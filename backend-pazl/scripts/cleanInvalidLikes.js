
const mongoose = require('mongoose');
const Post = require('../models/Post');
require('dotenv').config();

async function clean() {
	await mongoose.connect(process.env.MONGODB_URI || 'mongodb://aleksandr:pazlpass@localhost:27017/pazldb?authSource=admin');
    const posts = await Post.find({});

    for (const post of posts) {
        let changed = false;

        const validLikes = post.likes?.filter(item => item && item.userId) || [];
        if (validLikes.length !== post.likes?.length) {
            post.likes = validLikes;
            changed = true;
        }

        const validDislikes = post.dislikes?.filter(item => item && item.userId) || [];
        if (validDislikes.length !== post.dislikes?.length) {
            post.dislikes = validDislikes;
            changed = true;
        }

        if (changed) {
            await post.save({ validateBeforeSave: false });
            console.log(`Пост ${post._id} очищен`);
        }
    }
    console.log('✅ Готово');
    await mongoose.disconnect();
}

clean();
