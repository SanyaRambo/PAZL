const express = require("express");
const { generateDate } = require("../helpers/dataHelpers");
const UserStats = require("../models/UserStats");
const authenticated = require("../middlewares/authenticated");

const router = express.Router();

router.use(authenticated);

router.get("/stats", authenticated, async (req, res) => {
	try {
		const stats = await UserStats.findOne({ userId: req.user.id });
		if (!stats) {
			return res
				.status(404)
				.json({ res: null, error: "Статистика не найдена" });
		}
		res.json({ res: stats, error: null });
	} catch (err) {
		res.status(500).json({ res: null, error: err.message });
	}
});


module.exports = router;
