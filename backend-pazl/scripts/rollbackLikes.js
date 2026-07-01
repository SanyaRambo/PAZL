const mongoose = require('mongoose');
const Post = require('../models/Post');
require('dotenv').config();

async function rollback() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Подключено');

    const posts = await Post.find({});
    let updated = 0;

    for (const post of posts) {
      let changed = false;

      // Откат likes: из объектов обратно в ObjectId
      if (post.likes && post.likes.length > 0 && post.likes[0].userId) {
        const newLikes = post.likes.map(item => item.userId);
        post.likes = newLikes;
        changed = true;
      }

      // Аналогично для dislikes
      if (post.dislikes && post.dislikes.length > 0 && post.dislikes[0].userId) {
        const newDislikes = post.dislikes.map(item => item.userId);
        post.dislikes = newDislikes;
        changed = true;
      }

      if (changed) {
        await post.save();
        updated++;
        console.log(`🔄 Откачен пост: ${post._id}`);
      }
    }

    console.log(`✅ Откат завершён. Обновлено: ${updated}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Ошибка:', err);
    process.exit(1);
  }
}

rollback();