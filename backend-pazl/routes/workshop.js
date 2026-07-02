const express = require("express");
const authenticated = require("../middlewares/authenticated");
const { getUserPosts } = require("../controllers/post");
const mapPost = require("../helpers/mapPost");
const asyncHandler = require("../middlewares/asyncHandler"); 

const router = express.Router({ mergeParams: true });

router.use(authenticated);

router.get(
	"/publicationsUser",
	asyncHandler(async (req, res) => {
		const {
			limit = 10,
			offset = 0,
			search,
			isPublished,
			sortBy,
			order,
		} = req.query;
		const includeIsPublishedFlag = isPublished === "true";

		const postsListData = await getUserPosts({
			limit,
			offset,
			search,
			isPublished: includeIsPublishedFlag,
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

module.exports = router;
