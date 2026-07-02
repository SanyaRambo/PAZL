const express = require("express");
const { register, login } = require("../controllers/user");
const mapUser = require("../helpers/mapUser");
const authenticated = require("../middlewares/authenticated");
const asyncHandler = require("../middlewares/asyncHandler"); 
const { generateDate } = require("../helpers/dataHelpers");

const router = express.Router({ mergeParams: true });

// ==================== POST ====================

router.post(
	"/register",
	asyncHandler(async (req, res) => {
		const { user, token } = await register({
			login: req.body.login,
			password: req.body.password,
			replayPassword: req.body.replayPassword,
			createdAt: generateDate(),
			updatedAt: generateDate(),
		});

		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		}).send({
			error: null,
			user: mapUser(user),
		});
	}),
);

router.post(
	"/login",
	asyncHandler(async (req, res) => {
		const { user, token } = await login(req.body.login, req.body.password);

		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		}).send({
			error: null,
			user: mapUser(user),
		});
	}),
);

router.post(
	"/logout",
	asyncHandler(async (req, res) => {
		res.cookie("token", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 0,
		}).send({});
	}),
);

// ==================== GET ====================

router.get(
	"/me",
	authenticated,
	asyncHandler(async (req, res) => {
		res.send({ user: mapUser(req.user) });
	}),
);

module.exports = router;
