const mongoose = require("mongoose");
const User = require("../models/User");
const { updateUserStats } = require("../service/statsService");
require("dotenv").config();

async function initStats() {
	await mongoose.connect(
		process.env.MONGODB_URI ||
			"mongodb://aleksandr:pazlpass@localhost:27017/pazldb?authSource=admin",
	);
	const users = await User.find({});
	console.log(`Найдено пользователей: ${users.length}`);
	for (const user of users) {
		await updateUserStats(user._id);
		console.log(`Обновлено для пользователя ${user.login || user._id}`);
	}
	console.log("✅ Статистика инициализирована");
	process.exit();
}
initStats();
