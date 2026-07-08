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

		const stats = await UserStats.findOne({ userId: req.user.id }).lean({ virtuals: true });

		if (!stats) {
			return res.status(404).json({ res: null, error: "Статистики нет. Будьте активным пользователям, чтобы у вас появилось статистика" });
		}

		res.json({ res: stats, error: null });
	}),
);

module.exports = router;
