const mongoose = require("mongoose");
const { updateUserStats } = require("../service/statsService");
const validator = require("validator");

const PostSchema = mongoose.Schema(
	{
		title: {
			type: String,
			default: null,
		},
		image: {
			type: String,
			default: null,
			validate: {
				validator: function (v) {
					return (
						v === null ||
						validator.isURL(v) ||
						(typeof v === "string" && v.startsWith("/uploads/"))
					);
				},
				message: "Image should be a valid url or upload path",
			},
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			type: mongoose.Schema.Types.Mixed,
			default: null,
		},
		publishedAt: {
			type: Date,
			default: null,
		},
		editedAt: {
			type: Date,
			default: null,
		},
		isPublished: {
			type: Boolean,
			default: false,
		},
		avatarAuthor: {
			type: String,
			default: null,
			validate: {
				validator: function (v) {
					return (
						v === null ||
						validator.isURL(v) ||
						(typeof v === "string" && v.startsWith("/uploads/"))
					);
				},
				message: "Image should be a valid url or upload path",
			},
		},
		likes: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				likedAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		dislikes: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				likedAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		views: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true },
);

PostSchema.post("save", async function (doc) {
	try {
		await updateUserStats(doc.author);
	} catch (e) {
		console.error("Ошибка обновления статистики (save):", e);
	}
});

PostSchema.post("findOneAndDelete", async function (doc) {
	try {
		if (doc) {
			await updateUserStats(doc.author);
		}
	} catch (e) {
		console.error("Ошибка обновления статистики (findOneAndDelete):", e);
	}
});

PostSchema.post("findOneAndUpdate", async function (doc) {
	try {
		await updateUserStats(doc.author);
	} catch (err) {
		console.error("Ошибка обновления статистики (findOneAndUpdate):", err);
	}
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
