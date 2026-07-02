const express = require("express");
const authenticated = require("../middlewares/authenticated");
const asyncHandler = require("../middlewares/asyncHandler"); 
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

// ==================== GET ====================

router.get(
	"/friends",
	asyncHandler(async (req, res) => {
		const {
			limit = 20,
			offset = 0,
			search = "",
			sortBy,
			order,
		} = req.query;
		const result = await getFriends(req.user.id, {
			limit,
			offset,
			search,
			sortBy,
			order,
		});

		res.send({
			res: {
				items: result.items.map(mapUser),
				totalCount: result.totalCount,
				hasMore: result.hasMore,
			},
			error: null,
		});
	}),
);

router.get(
	"/following",
	asyncHandler(async (req, res) => {
		const {
			limit = 20,
			offset = 0,
			search = "",
			sortBy,
			order,
		} = req.query;
		const result = await getFollowing(req.user.id, {
			limit,
			offset,
			search,
			sortBy,
			order,
		});
		res.send({
			res: {
				items: result.items.map(mapUser),
				totalCount: result.totalCount,
				hasMore: result.hasMore,
			},
			error: null,
		});
	}),
);

router.get(
	"/followers",
	asyncHandler(async (req, res) => {
		const {
			limit = 20,
			offset = 0,
			search = "",
			sortBy,
			order,
		} = req.query;
		const result = await getFollowers(req.user.id, {
			limit,
			offset,
			search,
			sortBy,
			order,
		});
		res.send({
			res: {
				items: result.items.map(mapUser),
				totalCount: result.totalCount,
				hasMore: result.hasMore,
			},
			error: null,
		});
	}),
);

router.get(
	"/requests",
	asyncHandler(async (req, res) => {
		const {
			limit = 20,
			offset = 0,
			search = "",
			sortBy,
			order,
		} = req.query;
		const result = await getFriendRequests(req.user.id, {
			limit,
			offset,
			search,
			sortBy,
			order,
		});
		res.send({
			res: {
				items: result.items.map(mapUser),
				totalCount: result.totalCount,
				hasMore: result.hasMore,
			},
			error: null,
		});
	}),
);

router.get(
	"/sent",
	asyncHandler(async (req, res) => {
		const {
			limit = 20,
			offset = 0,
			search = "",
			sortBy,
			order,
		} = req.query;
		const result = await getSentRequests(req.user.id, {
			limit,
			offset,
			search,
			sortBy,
			order,
		});
		res.send({
			res: {
				items: result.items.map(mapUser),
				totalCount: result.totalCount,
				hasMore: result.hasMore,
			},
			error: null,
		});
	}),
);

// ==================== POST ====================

router.post(
	"/follow/:userId",
	asyncHandler(async (req, res) => {
		const result = await toggleFollow(req.user.id, req.params.userId);
		res.send({ res: result, error: null });
	}),
);

router.post(
	"/request/:userId",
	asyncHandler(async (req, res) => {
		await sendFriendRequest(req.user.id, req.params.userId);
		res.send({ res: "Заявка отправлена", error: null });
	}),
);

router.post(
	"/request/:userId/accept",
	asyncHandler(async (req, res) => {
		await acceptFriendRequest(req.user.id, req.params.userId);
		res.send({ res: "Заявка принята", error: null });
	}),
);

// ==================== DELETE ====================

router.delete(
	"/request/:userId",
	asyncHandler(async (req, res) => {
		await rejectFriendRequest(req.user.id, req.params.userId);
		res.send({ res: "Заявка отклонена", error: null });
	}),
);

router.delete(
	"/request/cancel/:userId",
	asyncHandler(async (req, res) => {
		await cancelFriendRequest(req.user.id, req.params.userId);
		res.send({ res: "Заявка отменена", error: null });
	}),
);

router.delete(
	"/:userId",
	asyncHandler(async (req, res) => {
		await removeFriend(req.user.id, req.params.userId);
		res.send({ res: "Друг удалён", error: null });
	}),
);

module.exports = router;
