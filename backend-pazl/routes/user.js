const express = require("express");
const {
	getUsers,
	getRoles,
	updateUser,
	deleteUser,
	getUserProfile,
	updateUserProfile,
	deleteUserProfile,
} = require("../controllers/user");
const { getUserPosts } = require("../controllers/post");
const mapPost = require("../helpers/mapPost");
const hasRole = require("../middlewares/hasRole");
const authenticated = require("../middlewares/authenticated");
const mapUser = require("../helpers/mapUser");
const ROLES = require("../constants/roles");
const asyncHandler = require("../middlewares/asyncHandler"); 

const router = express.Router({ mergeParams: true });

// ==================== GET ====================

router.get(
	"/users",
	authenticated,
	asyncHandler(async (req, res) => {
		const {
			limit = 10,
			offset = 0,
			search,
			includeDeleted,
			order,
			sortBy,
		} = req.query;
		const includeDeletedFlag = includeDeleted === "true";
		const usersListData = await getUsers({
			limit,
			offset,
			search,
			includeDeleted: includeDeletedFlag,
			order,
			sortBy,
		});
		res.send({
			res: {
				items: usersListData.items.map(mapUser),
				totalCount: usersListData.totalCount,
				hasMore: usersListData.hasMore,
			},
			error: null,
		});
	}),
);

router.get(
	"/roles",
	authenticated,
	asyncHandler(async (req, res) => {
		const roles = getRoles();
		res.send({ res: roles });
	}),
);

router.get(
	"/:userId",
	authenticated,
	asyncHandler(async (req, res) => {
		const profile = await getUserProfile(req.params.userId);
		res.send({ res: profile, error: null });
	}),
);

router.get(
	"/publicationsUser/:userId",
	asyncHandler(async (req, res) => {
		const { isPublished, order, sortBy } = req.query;
		const includeIsPublishedFlag = isPublished === "true";

		const postsListData = await getUserPosts({
			isPublished: includeIsPublishedFlag,
			author: req.params.userId,
			order,
			sortBy,
		});

		res.send({
			res: postsListData.items.map((post) => mapPost(post, req.user?.id)),
			error: null,
		});
	}),
);

// ==================== PATCH ====================

router.patch(
	"/:id",
	authenticated,
	hasRole([ROLES.ADMIN]),
	asyncHandler(async (req, res) => {
		const updatedUser = await updateUser(
			req.params.id,
			{ idRole: req.body.selectedRole },
			req.user.idRole,
			req.user.id,
		);
		res.send({ data: mapUser(updatedUser) });
	}),
);

router.patch(
	"/",
	authenticated,
	asyncHandler(async (req, res) => {
		const updated = await updateUserProfile(req.user.id, req.body);
		res.send({ res: mapUser(updated), error: null });
	}),
);

// ==================== DELETE ====================

router.delete(
	"/:id",
	authenticated,
	hasRole([ROLES.ADMIN]),
	asyncHandler(async (req, res) => {
		const deletedUser = await deleteUser(
			req.params.id,
			req.user.id,
			req.user.idRole,
		);
		res.send({ data: mapUser(deletedUser) });
	}),
);

router.delete(
	"/",
	authenticated,
	asyncHandler(async (req, res) => {
		await deleteUserProfile(req.user.id);
		res.send({ res: "Профиль удалён", error: null });
	}),
);

module.exports = router;
