const Post = require("../models/Post");
const Comment = require("../models/Comment");
const mongoose = require("mongoose");
const extractImageUrls = require("../helpers/extractImageUrls");
const fs = require("fs").promises;
const path = require("path");
const { updateUserStats } = require("../service/statsService");
const mapPost = require("../helpers/mapPost");
const { buildSortOptions } = require("../helpers/sortHelpers");
const { buildQuery } = require("../helpers/queryHelpers");
const {
	POST_FEED_SORT_FIELDS,
	POST_USER_SORT_FIELDS,
	POST_LIKED_SORT_FIELDS,
} = require("../constants/sortFields");
const ROLES = require("../constants/roles");

async function addPost(post) {
	const newPost = await Post.create(post);
	await newPost.populate("author");
	return newPost;
}

async function updatePost(postId, userId, postData) {
	const post = await Post.findById(postId);
	if (!post) throw new Error("Post not found");
	if (post.author.toString() !== userId) throw new Error("Access denied");
	const updated = await Post.findByIdAndUpdate(postId, postData, {
		returnDocument: "after",
	}).populate("author");
	return updated;
}

async function cascadeDeletePost(postId, currentUser) {
	const post = await Post.findById(postId);
	if (!post) throw new Error("Post not found");

	const isAdmin = currentUser.idRole === ROLES.ADMIN;
	const isAuthor = post.author.toString() === currentUser.id;

	if (!isAdmin && !isAuthor) {
		throw new Error("Access denied");
	}

	await Comment.deleteMany({ idPublication: postId });

	if (post.image) {
		await deleteImageFile(post.image);
	}
	if (post.content) {
		const imageUrls = extractImageUrls(post.content);
		for (const url of imageUrls) {
			await deleteImageFile(url);
		}
	}
	const deletedPost = await Post.findByIdAndDelete(postId);
	return deletedPost;
}

async function deleteImageFile(imageUrl) {
	if (
		!imageUrl ||
		typeof imageUrl !== "string" ||
		!imageUrl.startsWith("/uploads/")
	)
		return;
	let filename = imageUrl.split("/").pop();
	if (filename.includes("?")) filename = filename.split("?")[0];
	if (!filename) return;
	const filePath = path.join(__dirname, "../uploads", filename);
	try {
		await fs.unlink(filePath);
	} catch (err) {
		console.error(`Failed to delete file ${filePath}:`, err.message);
	}
}

async function getPosts({
	limit,
	offset,
	search,
	isPublished = true,
	author,
	sortBy,
	order,
}) {
	const query = buildQuery({ search, isPublished, author });

	const sortOptions = buildSortOptions(
		sortBy,
		order,
		POST_FEED_SORT_FIELDS,
		"publishedAt",
	);
	const [posts, total] = await Promise.all([
		Post.find(query)
			.sort(sortOptions)
			.skip(Number(offset))
			.limit(Number(limit))
			.populate("author"),
		Post.countDocuments(query),
	]);
	return {
		items: posts,
		totalCount: total,
		hasMore: Number(offset) + posts.length < total,
	};
}

async function getUserPosts({
	limit,
	offset,
	search,
	isPublished,
	author,
	sortBy,
	order,
}) {
	const query = buildQuery({ search, isPublished, author });

	const sortOptions = buildSortOptions(
		sortBy,
		order,
		POST_USER_SORT_FIELDS,
		"createdAt",
	);

	const [posts, total] = await Promise.all([
		Post.find(query)
			.sort(sortOptions)
			.skip(Number(offset))
			.limit(Number(limit))
			.populate("author"),
		Post.countDocuments(query),
	]);
	return {
		items: posts,
		totalCount: total,
		hasMore: Number(offset) + posts.length < total,
	};
}

async function getLikedPosts(userId, { limit, offset, search, sortBy, order }) {
	const userIdObj = new mongoose.Types.ObjectId(userId);

	const match = {
		likes: { $elemMatch: { userId: userIdObj } },
		$or: [{ isPublished: true }, { author: userIdObj }],
	};

	if (search) {
		match.title = { $regex: search, $options: "i" };
	}

	// Если сортировка НЕ по likedAt – используем обычный find (он работает)
	if (sortBy !== "likedAt") {
		const sortOptions = buildSortOptions(
			sortBy,
			order,
			POST_LIKED_SORT_FIELDS,
			"likedAt",
		);
		const [posts, total] = await Promise.all([
			Post.find(match)
				.sort(sortOptions)
				.skip(Number(offset))
				.limit(Number(limit))
				.populate("author"),
			Post.countDocuments(match),
		]);
		return {
			items: posts,
			totalCount: total,
			hasMore: Number(offset) + posts.length < total,
		};
	}

	// ✅ Сортировка по likedAt – агрегация (теперь точно!)
	const sortOrder = order === "asc" ? 1 : -1;

	const pipeline = [
		{ $match: match },
		{
			$addFields: {
				userLikeDate: {
					$let: {
						vars: {
							like: {
								$arrayElemAt: [
									{
										$filter: {
											input: "$likes",
											as: "like",
											cond: {
												$eq: [
													"$$like.userId",
													userIdObj,
												],
											}, // ✅ сравниваем с ObjectId
										},
									},
									0,
								],
							},
						},
						in: "$$like.likedAt",
					},
				},
			},
		},
		{ $sort: { userLikeDate: sortOrder, _id: 1 } },
		{ $skip: Number(offset) },
		{ $limit: Number(limit) },
		{
			$lookup: {
				from: "users",
				localField: "author",
				foreignField: "_id",
				as: "author",
			},
		},
		{ $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
	];

	// Подсчёт общего количества
	const countPipeline = [{ $match: match }, { $count: "total" }];

	const [posts, countResult] = await Promise.all([
		Post.aggregate(pipeline),
		Post.aggregate(countPipeline),
	]);

	const total = countResult[0]?.total || 0;

	return {
		items: posts,
		totalCount: total,
		hasMore: Number(offset) + posts.length < total,
	};
}

function getPost(id) {
	return Post.findByIdAndUpdate(
		id,
		{ $inc: { views: 1 } },
		{ returnDocument: "after" },
	).populate("author");
}

async function updateLikeDislikePost(postId, userId, action) {
	try {
		const post = await Post.findById(postId);
		if (!post) throw new Error("Post not found");

		const existingLike = post.likes?.find(
			(item) => item?.userId?.toString() === userId,
		);
		const existingDislike = post.dislikes?.find(
			(item) => item?.userId?.toString() === userId,
		);

		if (action === "like") {
			if (existingLike) {
				post.likes = post.likes.filter(
					(item) => item?.userId?.toString() !== userId,
				);
			} else {
				if (existingDislike) {
					post.dislikes = post.dislikes.filter(
						(item) => item?.userId?.toString() !== userId,
					);
				}
				post.likes.push({ userId, likedAt: new Date() });
			}
		} else if (action === "dislike") {
			if (existingDislike) {
				post.dislikes = post.dislikes.filter(
					(item) => item?.userId?.toString() !== userId,
				);
			} else {
				if (existingLike) {
					post.likes = post.likes.filter(
						(item) => item?.userId?.toString() !== userId,
					);
				}
				post.dislikes.push({ userId, likedAt: new Date() });
			}
		} else {
			throw new Error("Invalid action: must be 'like' or 'dislike'");
		}

		const updatedPost = await post.save();
		try {
			await updateUserStats(userId);
		} catch (e) {
			console.error("Ошибка обновления статистики при лайке:", e);
		}
		await updatedPost.populate("author");
		return mapPost(updatedPost, userId);
	} catch (error) {
		console.error("Error in updateLikeDislikePost:", error);
		throw error;
	}
}

module.exports = {
	getPost,
	getPosts,
	getUserPosts,
	getLikedPosts,
	addPost,
	updatePost,
	cascadeDeletePost,
	updateLikeDislikePost,
};
