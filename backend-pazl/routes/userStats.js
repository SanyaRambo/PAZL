const express = require("express");
const authenticated = require("../middlewares/authenticated");
const asyncHandler = require("../middlewares/asyncHandler"); 
const UserStats = require("../models/UserStats");

const router = express.Router();

router.use(authenticated);

router.get(
	"/stats",
	authenticated,
	asyncHandler(async (req, res) => {
		const stats = await UserStats.findOne({ userId: req.user.id });
		if (!stats) {
			return res
				.status(404)
				.json({ res: null, error: "Статистика не найдена" });
		}
		res.json({ res: stats, error: null });
	}),
);

module.exports = router;
