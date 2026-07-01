const mongoose = require("mongoose");
const { updateUserStats } = require("../service/statsService");
const { validator } = require("validator")

const CommentSchema = mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	authorAvatar: {
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
	idPublication: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post",
		required: true,
	},

	text: {
		type: String,
		required: true,
	},
	editedAt: {
		type: Date,
		default: null,
	},
	publishedAt: {
		type: Date,
		required: true,
	},
	idParent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment",
		default: null,
	},
	likes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	dislikes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
});

CommentSchema.post("save", async function (doc) {
	try {
		await updateUserStats(doc.author);
	} catch (e) {
		console.error("Ошибка обновления статистики (save):", e);
	}
});

CommentSchema.post("findOneAndDelete", async function (doc) {
	try {
		if (doc) {
			await updateUserStats(doc.author);
		}
	} catch (e) {
		console.error("Ошибка обновления статистики (findOneAndDelete):", e);
	}
});

CommentSchema.post("findOneAndUpdate", async function (doc) {
	try {
		await updateUserStats(doc.author);
	} catch (e) {
		console.error("Ошибка обновления статистики (save):", e);
	}
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
