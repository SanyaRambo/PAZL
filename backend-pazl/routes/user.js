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
const User = require("../models/User");

const router = express.Router({ mergeParams: true });

router.get("/users", authenticated, async (req, res) => {
	try {
		const { limit = 10, offset = 0, search, includeDeleted } = req.query;
		const includeDeletedFlag = includeDeleted === "true";
		const usersListData = await getUsers({
			limit,
			offset,
			search,
			includeDeleted: includeDeletedFlag,
		});
		res.send({
			res: {
				items: usersListData.items.map(mapUser),
				totalCount: usersListData.totalCount,
				hasMore: usersListData.hasMore,
			},
			error: null,
		});
	} catch (e) {
		res.send({ res: null, error: e.message || "Unknown error" });
	}
});

router.get("/roles", authenticated, async (req, res) => {
	const roles = getRoles();
	res.send({ res: roles });
});

router.patch(
	"/:id",
	authenticated,
	hasRole([ROLES.ADMIN]),
	async (req, res) => {
		const updatedUser = await updateUser(
			req.params.id,
			{ idRole: req.body.selectedRole },
			req.user.idRole,
			req.user.id,
		);
		res.send({ data: mapUser(updatedUser) });
	},
);

router.delete(
	"/:id",
	authenticated,
	hasRole([ROLES.ADMIN]),
	async (req, res) => {
		const deletedUser = await deleteUser(
			req.params.id,
			req.user.id,
			req.user.idRole,
		);
		res.send({ data: mapUser(deletedUser) });
	},
);

router.get("/:userId", authenticated, async (req, res) => {
	try {
		const profile = await getUserProfile(req.params.userId);

		res.send({ res: profile, error: null });
	} catch (e) {
		res.status(400).send({ res: null, error: e.message });
	}
});

router.patch("/", authenticated, async (req, res) => {
	try {
		const updated = await updateUserProfile(req.user.id, req.body);
		res.send({ res: mapUser(updated), error: null });
	} catch (e) {
		res.status(400).send({ res: null, error: e.message });
	}
});

router.delete("/", authenticated, async (req, res) => {
	try {
		await deleteUserProfile(req.user.id);
		res.send({ res: "Профиль удалён", error: null });
	} catch (e) {
		res.status(400).send({ res: null, error: e.message });
	}
});

router.get("/publicationsUser/:userId", async (req, res) => {
	try {
		const { isPublished } = req.query;
		const includeIsPublishedFlag = isPublished === "true";

		const postsListData = await getUserPosts({
			isPublished: includeIsPublishedFlag,
			author: req.params.userId,
		});

		res.send({
			res: postsListData.items.map((post) => mapPost(post, req.user?.id)),
			error: null,
		});
	} catch (e) {
		res.send({ res: null, error: e.message });
	}
});

module.exports = router;
