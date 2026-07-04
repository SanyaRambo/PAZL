const {formatDate} = require('../helpers/dataHelpers')

module.exports = function (post, currentUserId) {
    const isAuthorDeleted = !post.author || post.author.isDeleted;

    return {
        id: post.id || post._id,
        title: post.title,
        author: isAuthorDeleted
            ? `Deleted user: ${post.author.login}`
            : post.author.login,
		isAuthorDeleted: isAuthorDeleted,
		avatarAuthor: post.author.avatar || null,
        idAuthor: post.author.id || post.author._id,
        content: post.content,
        image: post.image,
        publishedAt: formatDate(post.publishedAt),
        editedAt: formatDate(post.editedAt),
        createdAt: formatDate(post.createdAt),
        updatedAt: formatDate(post.updatedAt),
        isPublished: post.isPublished,
        likesCount: post.likes?.length || 0,
        dislikesCount: post.dislikes?.length || 0,
        isLiked: currentUserId
            ? post.likes?.some(item => item?.userId?.toString() === currentUserId) ?? false
            : false,
        isDisliked: currentUserId
            ? post.dislikes?.some(item => item?.userId?.toString() === currentUserId) ?? false
            : false,
        views: post.views,
    };
};
