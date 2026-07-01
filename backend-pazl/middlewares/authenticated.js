const { verify } = require("../helpers/token");
const User = require("../models/User");

module.exports = async function (req, res, next) {
	try {
		const token = req.cookies.token;
		if (!token) {
			return res
				.status(401)
				.json({ res: null, error: "ПОЛЬЗОВАТЕЛЬ НЕ АВТОРИЗОВАН" });
		}

		let tokenData;
		try {
			tokenData = verify(token);
		} catch (err) {
			return res
				.status(401)
				.json({ res: null, error: "Недействительный токен" });
		}

		const user = await User.findOne({ _id: tokenData.id });
		if (!user) {
			return res
				.status(401)
				.json({ res: null, error: "Пользователь не найден" });
		}

		if (user.isDeleted) {
			return res
				.status(401)
				.json({ res: null, error: "Пользователь удалён" });
		}

		req.user = user;
		next();
	} catch (err) {
		console.error("Auth middleware error:", err);
		return res.status(500).json({ error: "Внутренняя ошибка сервера" });
	}
};
