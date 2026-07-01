const Task = require("../models/Task");

// Вспомогательная функция: если переданная дата валидна, возвращаем Date, иначе null
function normalizeDate(date) {
	if (!date) return null;
	const d = new Date(date);
	return isNaN(d.getTime()) ? null : d;
}

async function getTasks(userId, search) {
	let query = { userId };
	if (search) {
		query.title = { $regex: search, $options: "i" };
	}
	return await Task.find(query).sort({ createdAt: -1 });
}

async function addTask(task) {
	if (task.deadline) {
		task.deadline = new Date(task.deadline);
	}
	return await Task.create(task);
}

async function updateTask(userId, taskId, updateData) {
	const task = await Task.findById(taskId);
	if (!task) throw new Error("Task not found");
	if (task.userId.toString() !== userId) throw new Error("Access denied");

	if (updateData.deadline !== undefined) {
		updateData.deadline = normalizeDate(updateData.deadline);
	}

	return await Task.findByIdAndUpdate(taskId, updateData, {
		returnDocument: "after",
	});
}

async function deleteTask(userId, taskId) {
	const task = await Task.findById(taskId);
	if (!task) throw new Error("Task not found");
	if (task.userId.toString() !== userId) throw new Error("Access denied");
	return await Task.findByIdAndDelete(taskId);
}

module.exports = {
	getTasks,
	addTask,
	updateTask,
	deleteTask,
};
