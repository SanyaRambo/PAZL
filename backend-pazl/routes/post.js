const express = require("express");
const {
	getPosts,
	getPost,
	addPost,
	updatePost,
	cascadeDeletePost,
	updateLikeDislikePost,
	getUserPosts,
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

const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
	try {
		const { limit = 10, offset = 0, search, isPublished } = req.query;

		const includeIsPublishedFlag = isPublished === "true";

		const postsListData = await getPosts({
			limit,
			offset,
			search,
			isPublished: includeIsPublishedFlag,
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
	} catch (e) {
		res.send({
			res: null,
			error: e.message,
		});
	}
});

router.get("/publicationsUser", authenticated, async (req, res) => {
	try {
		const postsListData = await getUserPosts({ author: req.user?.id });
		res.send({
			res: {
				items: postsListData.items.map((post) =>
					mapPost(post, req.user?.id),
				),
			},
			error: null,
		});
	} catch (e) {
		res.send({ res: null, error: e.message });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const post = await getPost(req.params.id);
		res.send({ res: mapPost(post, req.user?.id), error: null });
	} catch (e) {
		res.send({ res: null, error: e.message });
	}
});

router.post("/", authenticated, async (req, res) => {
	try {
		const newPost = await addPost({
			title: req.body.title.trim(),
			author: req.user.id,
			isPublished: false,
		});

		res.send({
			res: mapPost(newPost),
			error: null,
		});
	} catch (e) {
		res.send({
			res: null,
			error: e.message,
		});
	}
});

router.get("/publicationsLiked", authenticated, async (req, res) => {
	try {
		const { limit = 10, offset = 0, search } = req.query;
		const userId = req.user.id;

		const postsListData = await getLikedPosts(userId, {
			limit,
			offset,
			search,
		});

		res.send({
			res: {
				items: postsListData.items.map((post) => mapPost(post, userId)),
				totalCount: postsListData.totalCount,
				hasMore: postsListData.hasMore,
			},
			error: null,
		});
	} catch (e) {
		res.send({ res: null, error: e.message });
	}
});


router.patch("/:id/content", authenticated, async (req, res) => {
	try {
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
	} catch (e) {
		res.send({
			res: null,
			error: e.message,
		});
	}
});


router.patch("/:id/publish", authenticated, async (req, res) => {
	try {
		const { isPublished } = req.body; // ожидаем true или false
		let updateData = {
			isPublished,
		};
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
	} catch (e) {
		res.send({
			res: null,
			error: e.message,
		});
	}
});

router.delete("/:id", authenticated, async (req, res) => {
	try {
		const deletedPost = await cascadeDeletePost(req.params.id, req.user);
		res.send({ res: deletedPost, error: null });
	} catch (e) {
		res.send({ res: null, error: e.message });
	}
});

router.get("/:id/comments", authenticated, async (req, res) => {
	try {
		const comments = await getComments(req.params.id);

		res.send({
			res: comments.map((comment) => mapComment(comment, req.user?.id)),
			error: null,
		});
	} catch (e) {
		res.send({
			res: null,
			error: e.message,
		});
	}
});

router.post("/:id/comments", authenticated, async (req, res) => {
	try {
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
	} catch (e) {
		res.send({
			res: null,
			error: e.message,
		});
	}
});

router.patch(
	"/:postId/comments/:commentId",
	authenticated,
	async (req, res) => {
		try {
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
		} catch (e) {
			res.send({
				res: null,
				error: e.message,
			});
		}
	},
);

router.patch(
	"/:postId/comments/:commentId/like",
	authenticated,
	async (req, res) => {
		try {
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
		} catch (e) {
			res.send({
				res: null,
				error: e.message,
			});
		}
	},
);

router.patch("/:postId/like", authenticated, async (req, res) => {
	try {
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
	} catch (e) {
		res.send({
			res: null,
			error: e.message,
		});
	}
});

router.delete(
	"/:postId/comments/:commentId",
	authenticated,
	async (req, res) => {
		try {
			await deleteCommentWithChildren(req.params.commentId, req.user);

			res.send({
				res: null,
				error: null,
			});
		} catch (e) {
			res.send({
				res: null,
				error: e.message,
			});
		}
	},
);

module.exports = router;
