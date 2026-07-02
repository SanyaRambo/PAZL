const Comment = require("../models/Comment");
const Post = require("../models/Post");
const mapComment = require("../helpers/mapComment");
const { buildSortOptions } = require("../helpers/sortHelpers");
const { COMMENT_SORT_FIELDS } = require("../constants/sortFields");
const ROLES = require("../constants/roles");

async function addComment(comment) {
	const newComment = await Comment.create(comment);
	await newComment.populate("author");
	return newComment;
}

async function updateComment(commentId, userId, commentData) {
	const comment = await Comment.findById(commentId);
	if (!comment) throw new Error("Comment not found");
	if (comment.author.toString() !== userId) throw new Error("Access denied");
	const updated = await Comment.findByIdAndUpdate(commentId, commentData, {
		returnDocument: "after",
	}).populate("author");
	return updated;
}

async function updateLikeDislikeComment(commentId, userId, action) {
	try {
		const comment = await Comment.findById(commentId);
		if (!comment) throw new Error("Comment not found");

		const hasLike = comment.likes.some((id) => id.equals(userId));
		const hasDislike = comment.dislikes.some((id) => id.equals(userId));

		if (action === "like") {
			if (hasLike) {
				comment.likes = comment.likes.filter(
					(id) => !id.equals(userId),
				);
			} else {
				if (hasDislike) {
					comment.dislikes = comment.dislikes.filter(
						(id) => !id.equals(userId),
					);
				}
				comment.likes.push(userId);
			}
		} else if (action === "dislike") {
			if (hasDislike) {
				comment.dislikes = comment.dislikes.filter(
					(id) => !id.equals(userId),
				);
			} else {
				if (hasLike) {
					comment.likes = comment.likes.filter(
						(id) => !id.equals(userId),
					);
				}
				comment.dislikes.push(userId);
			}
		} else {
			throw new Error("Invalid action: must be 'like' or 'dislike'");
		}

		const updatedComment = await comment.save();
		await updatedComment.populate("author");
		return mapComment(updatedComment, userId);
	} catch (error) {
		console.error("Error in updateLikeDislikeComment:", error);
		throw error;
	}
}

async function deleteCommentWithChildren(commentId, currentUser) {
	const comment = await Comment.findById(commentId).populate("idPublication");
	if (!comment) throw new Error("Comment not found");

	const isOwnerRights =
		currentUser.idRole === ROLES.ADMIN ||
		currentUser.idRole === ROLES.MODERATOR;
	const isAuthor = comment.author.toString() === currentUser.id;
	const isPostAuthor =
		comment.idPublication &&
		comment.idPublication.author.toString() === currentUser.id;

	if (!isOwnerRights && !isAuthor && !isPostAuthor) {
		throw new Error("Access denied");
	}

	const children = await Comment.find({ idParent: commentId });
	for (const child of children) {
		await deleteCommentWithChildren(child._id, currentUser);
	}
	await Comment.findByIdAndDelete(commentId);
}

async function getComments(idPost, sortBy = "publishedAt", order = "desc") {
	const comments = await Comment.find({ idPublication: idPost })
		.populate("author")
		.lean();

	const parents = comments.filter((c) => !c.idParent);
	const children = comments.filter((c) => c.idParent);

	const sortOptions = buildSortOptions(
		sortBy,
		order,
		COMMENT_SORT_FIELDS,
		"publishedAt",
	);

	const sortField = Object.keys(sortOptions)[0];
	const sortOrder = sortOptions[sortField] === 1 ? 1 : -1;

	parents.sort((a, b) => {
		if (a[sortField] < b[sortField]) return -sortOrder;
		if (a[sortField] > b[sortField]) return sortOrder;
		return 0;
	});

	children.sort((a, b) => a.publishedAt - b.publishedAt);

	const childrenMap = {};
	children.forEach((child) => {
		const parentId = child.idParent.toString();
		if (!childrenMap[parentId]) childrenMap[parentId] = [];
		childrenMap[parentId].push(child);
	});

	const result = [];
	parents.forEach((parent) => {
		result.push(parent);
		const parentChildren = childrenMap[parent._id.toString()] || [];
		result.push(...parentChildren);
	});

	return result;
}

module.exports = {
	addComment,
	deleteCommentWithChildren,
	getComments,
	updateComment,
	updateLikeDislikeComment,
};
