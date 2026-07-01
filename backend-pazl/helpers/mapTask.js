const { default: mongoose } = require("mongoose");
const { formatDate } = require("./dataHelpers");

module.exports = function (task) {
	return {
		id: task.id,
		userId: task.userId,
		title: task.title,
		description: task.description,
		isDone: task.isDone,
		deadline: task.deadline|| null,
		createdAt: formatDate(task.createdAt) || null,
		updatedAt: formatDate(task.updatedAt) || null,
	};
};
