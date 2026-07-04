const { formatDate } = require("./dataHelpers");

module.exports = function (comment, currentUserId) {
	const isAuthorDeleted = !comment.author || comment.author.isDeleted;

	return {
		id: comment.id || comment._id,
		idPublication: comment.idPublication,
		author: isAuthorDeleted
			? `Deleted user: ${comment.author.login}`
			: comment.author.login,
		isAuthorDeleted: isAuthorDeleted,
		avatarAuthor: comment.author.avatar || null,
		idAuthor: comment.author.id || comment.author._id,
		text: comment.text,
		publishedAt: formatDate(comment.publishedAt),
		editedAt: formatDate(comment.editedAt),
		idParent: comment.idParent,
		likesCount: comment.likes.length,
		dislikesCount: comment.dislikes.length,
		isLiked: currentUserId
			? comment.likes.some((id) => id.toString() === currentUserId)
			: false,
		isDisliked: currentUserId
			? comment.dislikes.some((id) => id.toString() === currentUserId)
			: false,
	};
};
