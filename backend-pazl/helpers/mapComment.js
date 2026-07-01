const { formatDate } = require("./dataHelpers");

module.exports = function (comment, currentUserId) {
	const isAuthorDeleted = !comment.author || comment.author.isDeleted;

	return {
		id: comment._id,
		idPublication: comment.idPublication,
		author: isAuthorDeleted
			? `Deleted user: ${comment.author.login}`
			: comment.author.login,
		isAuthorDeleted: isAuthorDeleted,
		avatarAuthor: comment.author.avatar || null,
		idAuthor: comment.author.id,
		text: comment.text,
		publishedAt: formatDate(comment.publishedAt),
		editedAt: formatDate(comment.editedAt),
		idParent: comment.idParent,
		likesCount: comment.likes.length,
		dislikesCount: comment.dislikes.length,
		isLiked: comment.likes.includes(currentUserId),
		isDisliked: comment.dislikes.includes(currentUserId),
	};
};
