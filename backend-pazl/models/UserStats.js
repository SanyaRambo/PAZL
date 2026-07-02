const mongoose = require("mongoose");

const UserStatsSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
		unique: true,
	},
	posts: {
		total: { type: Number, default: 0 },
		published: { type: Number, default: 0 },
		drafts: { type: Number, default: 0 },
		views: { type: Number, default: 0 },
		totalComments: { type: Number, default: 0 },
	},
	likes: {
		totalReaction: { type: Number, default: 0 },
		receivedLikes: { type: Number, default: 0 },
		receivedDislikes: { type: Number, default: 0 },
		likesGiven: { type: Number, default: 0 },
		dislikesGiven: { type: Number, default: 0 },
	},
	comments: { type: Number, default: 0 },
	tasks: {
		total: { type: Number, default: 0 },
		done: { type: Number, default: 0 },
		overdue: { type: Number, default: 0 },
	},
	lastActivity: { type: Date, default: null },
	updatedAt: { type: Date, default: Date.now },
	postsStats: [
		{
			postId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Post",
				required: true,
			},
			title: { type: String, default: "" },
			likes: { type: Number, default: 0 },
			dislikes: { type: Number, default: 0 },
			views: { type: Number, default: 0 },
			commentsCount: { type: Number, default: 0 },
			isPublished: { type: Boolean, default: false },
		},
	],
});



module.exports = mongoose.model("UserStats", UserStatsSchema);
