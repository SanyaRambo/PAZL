const express = require("express");
const { register, login } = require("../controllers/user");
const mapUser = require("../helpers/mapUser");
const authenticated = require("../middlewares/authenticated")
const { generateDate } = require("../helpers/dataHelpers");

const router = express.Router({ mergeParams: true });

router.post("/register", async (req, res) => {
	try {
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
	} catch (e) {
		if (e.code === 11000) {
			res.send({
				error: "This user already exists",
			});
		} else {
			res.send({
				error: e.message,
			});
		}
	}
});

router.post("/login", async (req, res) => {
	try {
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
	} catch (e) {
		if (e.code === 11000) {
			res.send({
				error: "This user already exists",
			});
		} else {
			res.send({
				error: e.message,
			});
		}
	}
});

router.post("/logout", (req, res) => {
	res.cookie("token", "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 0,
	}).send({});
});

router.get("/me", authenticated, (req, res) => {
	try {
		res.send({ user: mapUser(req.user) });
	} catch (e) {
		res.send({user: null,
			error: e.message
		})
	}
});

module.exports = router;
