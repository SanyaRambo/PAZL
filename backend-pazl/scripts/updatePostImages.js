const mongoose = require("mongoose");
const Post = require("../models/Post");

async function updateImages() {
	try {
		await mongoose.connect("mongodb://localhost:27017/pazldb", {
			auth: { username: "aleksandr", password: "pazlpass" },
			authSource: "admin",
		});
		console.log("✅ Подключено к MongoDB");

		// Находим все посты, созданные скриптом (у них content имеет формат редактора)
		const posts = await Post.find({ "content.type": "doc" });
		console.log(
			`📋 Найдено ${posts.length} постов с content в формате редактора`,
		);

		let updatedCount = 0;

		for (const post of posts) {
			// Генерируем seed на основе _id (берём строку ObjectId)
			const seed = post._id.toString();
			// Формируем URL картинки 1920x1080 с этим seed
			const imageUrl = `https://picsum.photos/seed/${seed}/1920/1080`;

			// Обновляем поле image, если оно отличается или равно null
			if (post.image !== imageUrl) {
				post.image = imageUrl;
				await post.save();
				updatedCount++;
				if (updatedCount % 10 === 0) {
					console.log(`🖼️ Обновлено ${updatedCount} постов`);
				}
			}
		}

		console.log(`✅ Готово! Обновлено ${updatedCount} постов.`);
		process.exit(0);
	} catch (err) {
		console.error("❌ Ошибка:", err.message);
		process.exit(1);
	}
}

updateImages();
