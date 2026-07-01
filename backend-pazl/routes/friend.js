const express = require("express");
const authenticated = require("../middlewares/authenticated");
const {
	toggleFollow,
	sendFriendRequest,
	acceptFriendRequest,
	rejectFriendRequest,
	cancelFriendRequest,
	removeFriend,
	getFriends,
	getFollowing,
	getFollowers,
	getFriendRequests,
	getSentRequests,
} = require("../controllers/friend");
const mapUser = require("../helpers/mapUser");

const router = express.Router();

router.use(authenticated);

router.get("/friends", async (req, res) => {
	try {
		const { limit = 20, offset = 0, search = "" } = req.query;
		const result = await getFriends(req.user.id, { limit, offset, search });

		res.send({
			res: {
				items: result.items.map(mapUser),
				totalCount: result.totalCount,
				hasMore: result.hasMore,
			},
			error: null,
		});
	} catch (e) {
		res.status(400).send({ res: null, error: e.message });
	}
});

router.get("/following", async (req, res) => {
	try {
		const { limit = 20, offset = 0, search = "" } = req.query;
		const result = await getFollowing(req.user.id, {
			limit,
			offset,
			search,
		});
		res.send({
			res: {
				items: result.items.map(mapUser),
				totalCount: result.totalCount,
				hasMore: result.hasMore,
			},
			error: null,
		});
	} catch (e) {
		res.status(400).send({ res: null, error: e.message });
	}
});

router.get("/followers", async (req, res) => {
	try {
		const { limit = 20, offset = 0, search = "" } = req.query;
		const result = await getFollowers(req.user.id, {
			limit,
			offset,
			search,
		});
		res.send({
			res: {
				items: result.items.map(mapUser),
				totalCount: result.totalCount,
				hasMore: result.hasMore,
			},
			error: null,
		});
	} catch (e) {
		res.status(400).send({ res: null, error: e.message });
	}
});

router.get("/requests", async (req, res) => {
	try {
		const { limit = 20, offset = 0, search = "" } = req.query;
		const result = await getFriendRequests(req.user.id, {
			limit,
			offset,
			search,
		});
		res.send({
			res: {
				items: result.items.map(mapUser),
				totalCount: result.totalCount,
				hasMore: result.hasMore,
			},
			error: null,
		});
	} catch (e) {
		res.status(400).send({ res: null, error: e.message });
	}
});

router.get("/sent", async (req, res) => {
	try {
		const { limit = 20, offset = 0, search = "" } = req.query;
		const result = await getSentRequests(req.user.id, {
			limit,
			offset,
			search,
		});
		res.send({
			res: {
				items: result.items.map(mapUser),
				totalCount: result.totalCount,
				hasMore: result.hasMore,
			},
			error: null,
		});
	} catch (e) {
		res.status(400).send({ res: null, error: e.message });
	}
});

router.post("/follow/:userId", async (req, res) => {
	try {
		const result = await toggleFollow(req.user.id, req.params.userId);
		res.send({ res: result, error: null });
	} catch (e) {
		res.status(400).send({ res: null, error: e.message });
	}
});

router.post("/request/:userId", async (req, res) => {
	try {
		await sendFriendRequest(req.user.id, req.params.userId);
		res.send({ res: "Заявка отправлена", error: null });
	} catch (e) {
		res.status(400).send({ res: null, error: e.message });
	}
});

router.post("/request/:userId/accept", async (req, res) => {
	try {
		await acceptFriendRequest(req.user.id, req.params.userId);
		res.send({ res: "Заявка принята", error: null });
	} catch (e) {
		res.status(400).send({ res: null, error: e.message });
	}
});

router.delete("/request/:userId", async (req, res) => {
	try {
		await rejectFriendRequest(req.user.id, req.params.userId);
		res.send({ res: "Заявка отклонена", error: null });
	} catch (e) {
		res.status(400).send({ res: null, error: e.message });
	}
});

router.delete("/request/cancel/:userId", async (req, res) => {
	try {
		await cancelFriendRequest(req.user.id, req.params.userId);
		res.send({ res: "Заявка отменена", error: null });
	} catch (e) {
		res.status(400).send({ res: null, error: e.message });
	}
});

router.delete("/:userId", async (req, res) => {
	try {
		await removeFriend(req.user.id, req.params.userId);
		res.send({ res: "Друг удалён", error: null });
	} catch (e) {
		res.status(400).send({ res: null, error: e.message });
	}
});

module.exports = router;
