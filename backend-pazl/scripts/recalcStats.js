const mongoose = require("mongoose");
const User = require("../models/User");
const { updateUserStats } = require("../service/statsService");

async function recalcAllStats() {
	try {
		await mongoose.connect("mongodb://localhost:27017/pazldb", {
			auth: { username: "aleksandr", password: "pazlpass" },
			authSource: "admin",
		});
		console.log("✅ Подключено к MongoDB");

		// Находим всех активных пользователей (не удалённых)
		const users = await User.find({ isDeleted: false });
		console.log(`📋 Найдено ${users.length} пользователей`);

		let updated = 0;
		for (const user of users) {
			try {
				await updateUserStats(user._id);
				updated++;
				if (updated % 10 === 0) {
					console.log(`🔄 Обновлено ${updated} пользователей`);
				}
			} catch (err) {
				console.error(
					`❌ Ошибка для пользователя ${user._id}:`,
					err.message,
				);
			}
		}

		console.log(
			`✅ Готово! Статистика пересчитана для ${updated} пользователей.`,
		);
		process.exit(0);
	} catch (err) {
		console.error("❌ Ошибка:", err.message);
		process.exit(1);
	}
}

recalcAllStats();
