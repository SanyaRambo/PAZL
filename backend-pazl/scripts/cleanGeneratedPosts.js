const mongoose = require("mongoose");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

async function cleanup() {
	try {
		await mongoose.connect("mongodb://localhost:27017/pazldb", {
			auth: { username: "aleksandr", password: "pazlpass" },
			authSource: "admin",
		});
		console.log("✅ Подключено к MongoDB");

		// 1. Находим все посты, у которых content — строка (это те, что создал скрипт)
		const postsToDelete = await Post.find({ content: { $type: "string" } });
		const postIds = postsToDelete.map((p) => p._id);

		if (postIds.length === 0) {
			console.log(
				"ℹ️ Постов с текстовым content не найдено. Ничего не удалено.",
			);
			process.exit(0);
		}

		console.log(`📋 Найдено ${postIds.length} постов для удаления`);

		// 2. Удаляем комментарии, которые ссылаются на эти посты
		const commentResult = await Comment.deleteMany({
			idPublication: { $in: postIds },
		});
		console.log(`🗑️ Удалено комментариев: ${commentResult.deletedCount}`);

		// 3. Удаляем сами посты
		const postResult = await Post.deleteMany({ _id: { $in: postIds } });
		console.log(`🗑️ Удалено постов: ${postResult.deletedCount}`);

		console.log("✅ Очистка завершена!");
		process.exit(0);
	} catch (err) {
		console.error("❌ Ошибка:", err.message);
		process.exit(1);
	}
}

cleanup();
