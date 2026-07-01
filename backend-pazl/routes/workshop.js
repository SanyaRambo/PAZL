const express = require("express");
const authenticated = require("../middlewares/authenticated");
const { getUserPosts } = require("../controllers/post");
const mapPost = require("../helpers/mapPost");

const router = express.Router({ mergeParams: true });

router.use(authenticated);

router.get("/publicationsUser", async (req, res) => {
	try {
		const { limit = 10, offset = 0, search, isPublished } = req.query;
		const includeIsPublishedFlag = isPublished === "true";

		const postsListData = await getUserPosts({
			limit,
			offset,
			search,
			isPublished: includeIsPublishedFlag,
			author: req.user.id,
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
		res.send({ res: null, error: e.message });
	}
});

module.exports = router;
