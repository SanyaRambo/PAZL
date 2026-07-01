const express = require("express");
const authenticated = require("../middlewares/authenticated");
const { getLikedPosts } = require("../controllers/post");
const mapPost = require("../helpers/mapPost");

const router = express.Router({ mergeParams: true });

router.use(authenticated);

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

module.exports = router;
