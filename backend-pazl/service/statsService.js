const mongoose = require("mongoose");

async function updateUserStats(userId) {
	try {
		const Post = mongoose.model("Post");
		const Comment = mongoose.model("Comment");
		const Task = mongoose.model("Task");
		const UserStats = mongoose.model("UserStats");

		const posts = await Post.find({ author: userId });

		const postsStats = [];
		let totalPosts = posts.length;
		let publishedPosts = 0;
		let draftPosts = 0;
		let totalViews = 0;
		let totalLikesReceived = 0;
		let totalDislikesReceived = 0;
		let totalCommentsOnPosts = 0;

		for (const post of posts) {
			const commentsCount = await Comment.countDocuments({
				idPublication: post._id,
			});

			const likesCount = post.likes?.length || 0;
			const dislikesCount = post.dislikes?.length || 0;

			totalLikesReceived += likesCount;
			totalDislikesReceived += dislikesCount;
			totalViews += post.views || 0;
			totalCommentsOnPosts += commentsCount;

			if (post.isPublished) {
				publishedPosts++;
			} else {
				draftPosts++;
			}

			postsStats.push({
				postId: post._id,
				title: post.title || "",
				likes: likesCount,
				dislikes: dislikesCount,
				views: post.views || 0,
				commentsCount: commentsCount,
				isPublished: post.isPublished,
			});
		}

		const likesGiven = await Post.countDocuments({
			likes: { $elemMatch: { userId: userId } },
		});

		const dislikesGiven = await Post.countDocuments({
			dislikes: { $elemMatch: { userId: userId } },
		});

		const userCommentsTotal = await Comment.countDocuments({
			author: userId,
		});

		const tasks = await Task.find({ userId: userId });
		const totalTasks = tasks.length;
		const doneTasks = tasks.filter((t) => t.isDone).length;
		const overdueTasks = tasks.filter(
			(t) => !t.isDone && t.deadline && new Date(t.deadline) < new Date(),
		).length;

		const statsData = {
			userId,
			posts: {
				total: totalPosts,
				published: publishedPosts,
				drafts: draftPosts,
				views: totalViews,
				totalComments: totalCommentsOnPosts,
			},
			likes: {
				totalReaction: totalLikesReceived + totalDislikesReceived,
				receivedLikes: totalLikesReceived,
				receivedDislikes: totalDislikesReceived,
				likesGiven: likesGiven,
				dislikesGiven: dislikesGiven,
			},
			comments: userCommentsTotal,
			tasks: {
				total: totalTasks,
				done: doneTasks,
				overdue: overdueTasks,
			},
			lastActivity: new Date(),
			updatedAt: new Date(),
			postsStats: postsStats,
		};

		await UserStats.findOneAndUpdate({ userId }, statsData, {
			upsert: true,
			returnDocument: "after",
		});

	} catch (err) {
		console.error(
			"❌ Ошибка в updateUserStats для userId",
			":",
			err,
		);
	}
}

module.exports = { updateUserStats };
