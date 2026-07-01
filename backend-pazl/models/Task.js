const mongoose = require("mongoose");
const { updateUserStats } = require("../service/statsService");

const TaskSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		title: {
			type: String,
			default: "Новая задача",
		},
		description: {
			type: mongoose.Schema.Types.Mixed,
			default: null,
		},
		isDone: {
			type: Boolean,
			default: false,
		},
		deadline: {
			type: Date,
			default: null,
		},
		updatedAt: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: { createdAt: true, updatedAt: false } },
);

TaskSchema.post("save", async function (doc) {
	try {
		await updateUserStats(doc.userId);
	} catch (e) {
		console.error("Ошибка обновления статистики (save):", e);
	}
});

TaskSchema.post("findOneAndDelete", async function (doc) {
	try {
		if (doc) {
			await updateUserStats(doc.userId);
		}
	} catch (e) {
		console.error("Ошибка обновления статистики (findOneAndDelete):", e);
	}
});

TaskSchema.post("findOneAndUpdate", async function (doc) {
	try {
		await updateUserStats(doc.userId);
	} catch (e) {
		console.error("Ошибка обновления статистики (save):", e);
	}
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
