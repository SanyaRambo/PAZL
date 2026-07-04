const express = require("express");
const authenticated = require("../middlewares/authenticated");
const { getLikedPosts } = require("../controllers/post");
const { getUserPosts } = require("../controllers/post");
const mapPost = require("../helpers/mapPost");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router({ mergeParams: true });

router.use(authenticated);

// ==================== GET ====================

router.get(
	"/publicationsUser/:userId",
	asyncHandler(async (req, res) => {
		const {
			limit = 1000,
			offset = 0,
			search,
			isPublished,
			sortBy,
			order,
		} = req.query;

		const postsListData = await getUserPosts({
			limit,
			offset,
			search,
			isPublished,
			author: req.user.id,
			sortBy,
			order,
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
	"/publicationsLiked",
	asyncHandler(async (req, res) => {
		const { limit = 1000, offset = 0, search, sortBy, order } = req.query;
		const userId = req.user.id;

		const postsListData = await getLikedPosts(userId, {
			limit,
			offset,
			search,
			sortBy,
			order,
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

module.exports = router;
