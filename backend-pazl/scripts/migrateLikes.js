const mongoose = require('mongoose');
const Post = require('../models/Post'); // путь к модели
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://aleksandr:pazlpass@localhost:27017/pazldb?authSource=admin';

async function migrateLikes() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Подключено к MongoDB');

        // Шаг 1: обновить все документы, преобразовав likes из ObjectId[] в массив объектов
        const result = await Post.collection.updateMany(
            { likes: { $exists: true, $type: 'array' } }, // только где есть массив
            [
                {
                    $set: {
                        likes: {
                            $map: {
                                input: '$likes',
                                as: 'likeId',
                                in: {
                                    userId: '$$likeId',
                                    likedAt: new Date() // или можно взять текущую дату, либо из поля createdAt
                                }
                            }
                        }
                    }
                }
            ]
        );
        console.log(`Обновлено likes: ${result.modifiedCount} документов`);

        // Шаг 2: аналогично для dislikes
        const result2 = await Post.collection.updateMany(
            { dislikes: { $exists: true, $type: 'array' } },
            [
                {
                    $set: {
                        dislikes: {
                            $map: {
                                input: '$dislikes',
                                as: 'dislikeId',
                                in: {
                                    userId: '$$dislikeId',
                                    likedAt: new Date()
                                }
                            }
                        }
                    }
                }
            ]
        );
        console.log(`Обновлено dislikes: ${result2.modifiedCount} документов`);

        // (Опционально) можно добавить поле likesCount и dislikesCount, если они используются
        await Post.collection.updateMany(
            {},
            [
                { $set: { likesCount: { $size: '$likes' } } },
                { $set: { dislikesCount: { $size: '$dislikes' } } }
            ]
        );
        console.log('Обновлены счётчики');

        console.log('✅ Миграция завершена успешно');
    } catch (error) {
        console.error('❌ Ошибка миграции:', error);
    } finally {
        await mongoose.disconnect();
    }
}

migrateLikes();
