const mongoose = require("mongoose");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { generateDate } = require("../helpers/dataHelpers");

// ============================================================
//  КОНФИГУРАЦИЯ
// ============================================================
const POSTS_COUNT = 150;
const COMMENTS_PER_POST_MIN = 3;
const COMMENTS_PER_POST_MAX = 10;
const REPLY_PROBABILITY = 0.3;
const MIN_LIKES = 0;
const MAX_LIKES = 15;
const MIN_DISLIKES = 0;
const MAX_DISLIKES = 5;

// ============================================================
//  СПЕЦИАЛЬНЫЕ ПОСТЫ (с картинками и готовым текстом)
// ============================================================
const specialPosts = [
	{
		image: "https://images.meme-arsenal.com/a451de3eb4832d5cabe9af9c8fd9304a.jpg",
		title: "Шрек – король мемов: почему зелёный огр стал культурным феноменом",
		paragraphs: [
			"Шрек — это не просто мультфильм, это целая эпоха интернет-культуры.",
			"Мемы с Шреком живут уже больше 20 лет, и их популярность не угасает.",
			"От 'Shrek is love, Shrek is life' до бесконечных переозвучек — зелёный огр стал символом абсурда и свободы самовыражения.",
			"В этом посте разберём, почему Шрек так полюбился мемоделам и как он отражает наше отношение к сказкам и стереотипам.",
			"А ещё — подборка самых смешных вариаций. Приятного просмотра!",
		],
	},
	{
		image: "https://i.pinimg.com/originals/96/d7/ab/96d7ab84adb8b8aa30f3321449c87416.jpg?nii=t",
		title: "Dark Souls: почему мы любим страдать?",
		paragraphs: [
			"Dark Souls — это игра, которая научила нас принимать поражение.",
			"Каждая смерть — это урок, каждый босс — вызов, а преодоление себя — главная награда.",
			"В этом посте я расскажу, как серия Souls повлияла на игровую индустрию, почему её сложность — это не баг, а фича, и какие философские идеи скрыты за мрачным геймплеем.",
			"Готовьтесь к ностальгии и, возможно, к желанию перепройти все части. Praise the Sun!",
		],
	},
	{
		image: "https://thecode.media/wp-content/uploads/2024/12/image9-5-1024x576.png",
		title: "Топ-5 ошибок начинающих разработчиков (и как их избежать)",
		paragraphs: [
			"Каждый джун проходит через одни и те же грабли.",
			"В этом посте я собрал самые частые проблемы: синдром самозванца, неумение гуглить, страх задавать вопросы, игнорирование код-ревью и погоню за идеальным кодом.",
			"Но главное — я дам практические советы, как превратить эти ошибки в опыт и ускорить свой карьерный рост.",
			"Если вы только начинаете — читайте обязательно! Это сэкономит вам месяцы нервов.",
		],
	},
	{
		image: "https://u.livelib.ru/reader/Arlett/o/m1fvj9tx/o-o.jpeg",
		title: "Бойцовский клуб: первое правило — не говорить о Бойцовском клубе",
		paragraphs: [
			"Фильм Дэвида Финчера стал культовым не только из-за шокирующего сюжета, но и благодаря глубокой философии.",
			"В этом посте я разбираю главные идеи фильма: борьбу с потребительским обществом, поиск идентичности, маскулинность и разрушение привычных ценностей.",
			"Почему Тайлер Дёрден так притягателен? И что на самом деле означает фраза 'Мы — поколение, которое выросло на рекламе'?",
			"Делитесь своими мыслями в комментариях — только без спойлеров для тех, кто ещё не смотрел.",
		],
	},
];

// ============================================================
//  ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ ГЕНЕРАЦИИ СЛУЧАЙНЫХ ПОСТОВ
// ============================================================
const postThemes = [
	"Путешествия",
	"Технологии",
	"Кулинария",
	"Спорт",
	"Кино",
	"Музыка",
	"Искусство",
	"Наука",
	"IT",
	"Бизнес",
	"Мотивация",
	"Здоровье",
	"Мода",
	"Фотография",
	"DIY",
];

const postTitleTemplates = [
	"Как я {theme} в {place}",
	"Мой опыт {theme}",
	"Топ 5 {theme}",
	"Почему {theme} важен",
	"{theme} для начинающих",
	"Секреты {theme}",
	"История моего {theme}",
	"Будущее {theme}",
	"{theme} в 2026",
	"Революция в {theme}",
];

const places = [
	"горах",
	"море",
	"лесу",
	"городе",
	"пустыне",
	"космосе",
	"прошлом",
	"будущем",
	"онлайне",
];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

function generatePostTitle(theme) {
	const template = randomItem(postTitleTemplates);
	return template
		.replace(/{theme}/g, theme)
		.replace(/{place}/g, randomItem(places));
}

// Генерация контента в формате редактора (doc + параграфы)
function generateEditorContent(paragraphs) {
	return {
		type: "doc",
		content: paragraphs.map((text) => ({
			type: "paragraph",
			attrs: { textAlign: null },
			content: [{ type: "text", text }],
		})),
	};
}

function generateRandomParagraphs(theme) {
	const sentences = [
		`В этом посте я хочу поделиться своим опытом в области ${theme}.`,
		`Многие спрашивают меня, с чего начать, и я рекомендую ${randomItem(["изучить основы", "попробовать простые проекты", "посмотреть видеоуроки", "почитать документацию"])}.`,
		`Одним из самых важных моментов является ${randomItem(["регулярная практика", "обратная связь", "терпение", "внимание к деталям"])}.`,
		`Лично я считаю, что ${theme} открывает огромные возможности для ${randomItem(["творчества", "заработка", "саморазвития", "общения"])}.`,
		`Не бойтесь ошибаться — ${randomItem(["ошибки делают нас сильнее", "это часть процесса", "главное — не сдаваться"])}.`,
		`Надеюсь, мой опыт будет полезен! Пишите свои мысли в комментариях.`,
	];
	const shuffled = [...sentences].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, Math.floor(Math.random() * 3) + 3);
}

// Генерация комментариев
const commentTemplates = [
	"Отличная статья! Спасибо за полезную информацию.",
	"Согласен с автором, особенно про {theme}.",
	"А я вот не совсем согласен. По-моему, {theme} это переоценено.",
	"Спасибо, очень познавательно. Сохранил в закладки.",
	"У меня был похожий опыт, когда {randomEvent}.",
	"А вы не думали о том, что {question}?",
	"Лучший пост за сегодня!",
	"Круто! А можно поподробнее про {detail}?",
	"Спасибо, что поделились. Очень вдохновляет.",
	"Ха-ха, забавно! У меня тоже так было.",
	"С нетерпением жду следующей части.",
	"А как же {alternative}? Тоже важный аспект.",
];

const randomEvents = [
	"я ездил в горы",
	"готовил ужин",
	"читал книгу",
	"смотрел фильм",
	"разрабатывал приложение",
	"играл в футбол",
	"убирался дома",
];
const details = ["инструменты", "источники", "цены", "сроки", "альтернативы"];
const alternatives = [
	"open source",
	"традиционный подход",
	"другой язык программирования",
	"классический метод",
];
const questions = [
	"это работает в любых условиях",
	"нужна ли специальная подготовка",
	"стоит ли оно того",
];

function generateCommentText(userLogin, postTheme) {
	const template = randomItem(commentTemplates);
	let text = template
		.replace(/{theme}/g, postTheme)
		.replace(/{randomEvent}/g, randomItem(randomEvents))
		.replace(/{detail}/g, randomItem(details))
		.replace(/{alternative}/g, randomItem(alternatives))
		.replace(/{question}/g, randomItem(questions));
	if (Math.random() > 0.7) text = `${userLogin}, ${text.toLowerCase()}`;
	return text;
}

function getRandomIds(allUserIds, count, excludeIds = []) {
	if (count <= 0) return [];
	const available = allUserIds.filter(
		(id) => !excludeIds.some((ex) => ex.equals(id)),
	);
	const shuffled = [...available].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
}

// ============================================================
//  ОСНОВНАЯ ФУНКЦИЯ
// ============================================================
async function generateAll() {
	try {
		await mongoose.connect("mongodb://localhost:27017/pazldb", {
			auth: { username: "aleksandr", password: "pazlpass" },
			authSource: "admin",
		});
		console.log("✅ Подключено к MongoDB");

		const users = await User.find({ isDeleted: false });
		if (users.length === 0)
			throw new Error("Нет пользователей. Сначала запусти seedUsers.js");
		console.log(`📋 Найдено ${users.length} пользователей`);
		const allUserIds = users.map((u) => u._id);

		// ----- Формируем данные для постов -----
		const postsData = [];

		// Специальные посты
		for (const sp of specialPosts) {
			const author = randomItem(users);
			const publishedAt = generateDate();
			const content = generateEditorContent(sp.paragraphs);
			const likesCount =
				Math.floor(Math.random() * (MAX_LIKES - MIN_LIKES + 1)) +
				MIN_LIKES;
			const dislikesCount =
				Math.floor(Math.random() * (MAX_DISLIKES - MIN_DISLIKES + 1)) +
				MIN_DISLIKES;
			const likes = getRandomIds(allUserIds, likesCount, [
				author._id,
			]).map((userId) => ({ userId }));
			const dislikes = getRandomIds(allUserIds, dislikesCount, [
				author._id,
				...likes.map((l) => l.userId),
			]).map((userId) => ({ userId }));

			postsData.push({
				title: sp.title,
				image: sp.image,
				author: author._id,
				content,
				publishedAt,
				editedAt: null,
				isPublished: true,
				avatarAuthor: author.avatar || null,
				likes,
				dislikes,
				views: Math.floor(Math.random() * 200),
			});
		}

		// Остальные посты (без картинок)
		const remainingCount = POSTS_COUNT - specialPosts.length;
		for (let i = 0; i < remainingCount; i++) {
			const theme = randomItem(postThemes);
			const title = generatePostTitle(theme);
			const paragraphs = generateRandomParagraphs(theme);
			const content = generateEditorContent(paragraphs);
			const author = randomItem(users);
			const publishedAt = generateDate();
			const likesCount =
				Math.floor(Math.random() * (MAX_LIKES - MIN_LIKES + 1)) +
				MIN_LIKES;
			const dislikesCount =
				Math.floor(Math.random() * (MAX_DISLIKES - MIN_DISLIKES + 1)) +
				MIN_DISLIKES;
			const likes = getRandomIds(allUserIds, likesCount, [
				author._id,
			]).map((userId) => ({ userId }));
			const dislikes = getRandomIds(allUserIds, dislikesCount, [
				author._id,
				...likes.map((l) => l.userId),
			]).map((userId) => ({ userId }));

			postsData.push({
				title,
				image: null,
				author: author._id,
				content,
				publishedAt,
				editedAt: null,
				isPublished: true,
				avatarAuthor: author.avatar || null,
				likes,
				dislikes,
				views: Math.floor(Math.random() * 200),
			});
		}

		// Перемешиваем
		for (let i = postsData.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[postsData[i], postsData[j]] = [postsData[j], postsData[i]];
		}

		console.log(
			`📝 Будет создано ${postsData.length} постов (${specialPosts.length} с картинками, ${remainingCount} без)`,
		);

		// ----- Вставка постов -----
		const createdPosts = await Post.insertMany(postsData);
		console.log(`✅ Создано ${createdPosts.length} постов`);

		// ----- Генерация комментариев -----
		const allCommentsData = [];
		let totalComments = 0;

		for (const post of createdPosts) {
			const commentsCount =
				Math.floor(
					Math.random() *
						(COMMENTS_PER_POST_MAX - COMMENTS_PER_POST_MIN + 1),
				) + COMMENTS_PER_POST_MIN;
			const postComments = [];

			// Создаём корневые комментарии
			for (let i = 0; i < commentsCount; i++) {
				const author = randomItem(users);
				const text = generateCommentText(author.login, post.title);
				const publishedAt = generateDate();
				const likes = getRandomIds(
					allUserIds,
					Math.floor(Math.random() * (MAX_LIKES - MIN_LIKES + 1)) +
						MIN_LIKES,
					[author._id],
				);
				const dislikes = getRandomIds(
					allUserIds,
					Math.floor(
						Math.random() * (MAX_DISLIKES - MIN_DISLIKES + 1),
					) + MIN_DISLIKES,
					[author._id, ...likes],
				);

				const commentData = {
					author: author._id,
					authorAvatar: author.avatar || null,
					idPublication: post._id,
					text,
					publishedAt,
					editedAt: null,
					idParent: null,
					likes,
					dislikes,
				};
				const comment = await Comment.create(commentData);
				postComments.push(comment);
			}

			// Добавляем ответы
			const possibleChildren = postComments.filter((_, idx) => idx > 0);
			for (const child of possibleChildren) {
				if (Math.random() < REPLY_PROBABILITY) {
					const parentCandidates = postComments.filter(
						(c) => !c._id.equals(child._id),
					);
					if (parentCandidates.length) {
						const parent = randomItem(parentCandidates);
						await Comment.findByIdAndUpdate(child._id, {
							idParent: parent._id,
						});
					}
				}
			}

			totalComments += postComments.length;
			if (postComments.length > 0) {
				console.log(
					`💬 Пост "${post.title.substring(0, 30)}…" — комментариев: ${postComments.length}`,
				);
			}
		}

		console.log(`\n🎉 Генерация завершена!`);
		console.log(
			`📊 Создано: ${createdPosts.length} постов, ${totalComments} комментариев`,
		);
		process.exit(0);
	} catch (err) {
		console.error("❌ Ошибка:", err.message);
		process.exit(1);
	}
}

generateAll();
