const express = require("express");
const {
	getPosts,
	getPost,
	addPost,
	updatePost,
	cascadeDeletePost,
	updateLikeDislikePost,
	getUserPosts,
	getLikedPosts,
} = require("../controllers/post");
const {
	addComment,
	deleteCommentWithChildren,
	getComments,
	updateComment,
	updateLikeDislikeComment,
} = require("../controllers/comment");
const authenticated = require("../middlewares/authenticated");
const hasRole = require("../middlewares/hasRole");
const mapPost = require("../helpers/mapPost");
const mapComment = require("../helpers/mapComment");
const { generateDate } = require("../helpers/dataHelpers");
const ROLES = require("../constants/roles");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router({ mergeParams: true });

// ==================== GET ====================

router.get(
	"/",
	asyncHandler(async (req, res) => {
		const {
			limit = 10,
			offset = 0,
			search,
			isPublished,
			order,
			sortBy,
		} = req.query;

		const includeIsPublishedFlag = isPublished === "true";

		const postsListData = await getPosts({
			limit,
			offset,
			search,
			isPublished: includeIsPublishedFlag,
			order,
			sortBy,
		});

		res.send({
			res: {
				items: postsListData.items.map((post) =>
					mapPost(post, req.user?.id),
				),
				totalCount: postsListData.totalCount,
				hasMore: postsListData.hasMore,
			},
			error: null,
		});
	}),
);

router.get(
	"/publicationsUser",
	authenticated,
	asyncHandler(async (req, res) => {
		const { limit = 10, offset = 0, sortBy, order } = req.query;
		const postsListData = await getUserPosts({
			author: req.user?.id,
			limit,
			offset,
			sortBy,
			order,
		});
		res.send({
			res: {
				items: postsListData.items.map((post) =>
					mapPost(post, req.user?.id),
				),
			},
			error: null,
		});
	}),
);

router.get(
	"/publicationsLiked",
	authenticated,
	asyncHandler(async (req, res) => {
		const { limit = 10, offset = 0, search, order, sortBy } = req.query;
		const userId = req.user.id;

		const postsListData = await getLikedPosts(userId, {
			limit,
			offset,
			search,
			order,
			sortBy,
		});

		res.send({
			res: {
				items: postsListData.items.map((post) => mapPost(post, userId)),
				totalCount: postsListData.totalCount,
				hasMore: postsListData.hasMore,
			},
			error: null,
		});
	}),
);

router.get(
	"/:id",
	asyncHandler(async (req, res) => {
		const post = await getPost(req.params.id);
		res.send({ res: mapPost(post, req.user?.id), error: null });
	}),
);

// ==================== POST ====================

router.post(
	"/",
	authenticated,
	asyncHandler(async (req, res) => {
		const newPost = await addPost({
			title: req.body.title.trim(),
			author: req.user.id,
			isPublished: false,
		});

		res.send({
			res: mapPost(newPost),
			error: null,
		});
	}),
);

router.post(
	"/:id/comments",
	authenticated,
	asyncHandler(async (req, res) => {
		const newComment = await addComment({
			text: req.body.text.trim(),
			author: req.user.id,
			idPublication: req.params.id,
			idParent: req.body.idParent,
			publishedAt: generateDate(),
		});

		res.send({
			res: mapComment(newComment),
			error: null,
		});
	}),
);

// ==================== PATCH ====================

router.patch(
	"/:id/content",
	authenticated,
	asyncHandler(async (req, res) => {
		const updatedPost = await updatePost(req.params.id, req.user.id, {
			title: req.body.title,
			content: req.body.content,
			image: req.body.image,
			editedAt: generateDate(),
		});

		res.send({
			res: mapPost(updatedPost),
			error: null,
		});
	}),
);

router.patch(
	"/:id/publish",
	authenticated,
	asyncHandler(async (req, res) => {
		const { isPublished } = req.body;
		let updateData = { isPublished };
		if (isPublished === true) {
			updateData.publishedAt = generateDate();
		} else {
			updateData.publishedAt = null;
		}

		const updatedPost = await updatePost(
			req.params.id,
			req.user.id,
			updateData,
		);

		res.send({
			res: mapPost(updatedPost, req.user?.id),
			error: null,
		});
	}),
);

router.patch(
	"/:postId/comments/:commentId",
	authenticated,
	asyncHandler(async (req, res) => {
		const updatedComment = await updateComment(
			req.params.commentId,
			req.user.id,
			{
				text: req.body.commentEdit,
				editedAt: generateDate(),
			},
		);

		res.send({
			res: mapComment(updatedComment),
			error: null,
		});
	}),
);

router.patch(
	"/:postId/comments/:commentId/like",
	authenticated,
	asyncHandler(async (req, res) => {
		const { action } = req.body;
		const updatedComment = await updateLikeDislikeComment(
			req.params.commentId,
			req.user.id,
			action,
		);

		res.send({
			res: updatedComment,
			error: null,
		});
	}),
);

router.patch(
	"/:postId/like",
	authenticated,
	asyncHandler(async (req, res) => {
		const { action } = req.body;
		const updatedPost = await updateLikeDislikePost(
			req.params.postId,
			req.user.id,
			action,
		);

		res.send({
			res: updatedPost,
			error: null,
		});
	}),
);

// ==================== DELETE ====================

router.delete(
	"/:id",
	authenticated,
	asyncHandler(async (req, res) => {
		const deletedPost = await cascadeDeletePost(req.params.id, req.user);
		res.send({ res: deletedPost, error: null });
	}),
);

router.delete(
	"/:postId/comments/:commentId",
	authenticated,
	asyncHandler(async (req, res) => {
		await deleteCommentWithChildren(req.params.commentId, req.user);
		res.send({
			res: null,
			error: null,
		});
	}),
);

// ==================== GET with comments ====================

router.get(
	"/:id/comments",
	authenticated,
	asyncHandler(async (req, res) => {
		const comments = await getComments(
			req.params.id,
			req.query.sortBy,
			req.query.order,
		);

		res.send({
			res: comments.map((comment) => mapComment(comment, req.user?.id)),
			error: null,
		});
	}),
);

module.exports = router;
