const { formatDate } = require("./dataHelpers");

module.exports = function (user) {
	return {
		id: user.id,
		login: user.login,
		idRole: user.idRole,
		registeredAt: formatDate(user.createdAt),
		isDeleted: user.isDeleted,
		deletedAt: formatDate(user.deletedAt),
		avatar: user.avatar || null,
		theme: user.theme || "dark",
	};
};
