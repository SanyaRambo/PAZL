const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const roles = require("../constants/roles");

// ----------------------------------------------------------------------
// Список имён (100 штук, чтобы не заморачиваться с дубликатами)
// Добавлены персонажи, реальные люди и обязательно Pupunya.
// ----------------------------------------------------------------------
const namesList = [
  // Кастомный пользователь
  "Pupunya",

  // Кино и мультфильмы
  "Harry Potter",
  "Hermione",
  "Ron Weasley",
  "Dumbledore",
  "Voldemort",
  "Frodo",
  "Gandalf",
  "Aragorn",
  "Legolas",
  "Gimli",
  "Tony Stark",
  "Steve Rogers",
  "Thor",
  "Bruce Banner",
  "Natasha",
  "Luke Skywalker",
  "Darth Vader",
  "Leia",
  "Han Solo",
  "Yoda",
  "SpongeBob",
  "Patrick",
  "Squidward",
  "Mr Krabs",
  "Sandy",
  "Mickey Mouse",
  "Donald Duck",
  "Goofy",
  "Pluto",
  "Minnie",
  "Shrek",
  "Fiona",
  "Donkey",
  "Puss in Boots",
  "Dragon",
  "Simba",
  "Mufasa",
  "Scar",
  "Timon",
  "Pumbaa",

  // Реальные исторические личности
  "Albert Einstein",
  "Isaac Newton",
  "Galileo",
  "Nikola Tesla",
  "Marie Curie",
  "Leonardo da Vinci",
  "Michelangelo",
  "Raphael",
  "Donatello",
  "Van Gogh",
  "William Shakespeare",
  "Charles Dickens",
  "Jane Austen",
  "Mark Twain",
  "Ernest Hemingway",
  "Julius Caesar",
  "Cleopatra",
  "Alexander the Great",
  "Napoleon",
  "Genghis Khan",
  "George Washington",
  "Abraham Lincoln",
  "Winston Churchill",
  "Martin Luther King",
  "Nelson Mandela",

  // Знаменитости / интернет-персонажи
  "Elon Musk",
  "Bill Gates",
  "Steve Jobs",
  "Jeff Bezos",
  "Mark Zuckerberg",
  "Michael Jackson",
  "Elvis Presley",
  "Freddie Mercury",
  "Madonna",
  "Beyonce",
  "Messi",
  "Ronaldo",
  "Michael Jordan",
  "Tiger Woods",
  "Serena Williams",

  // Остальные (чтобы набрать ровно 100, но их уже около 90, добавим ещё)
  "Mario",
  "Luigi",
  "Peach",
  "Bowser",
  "Zelda",
  "Link",
  "Ganon",
  "Pikachu",
  "Charizard",
  "Jigglypuff",
];

// Обрезаем до 100 (если больше – лишнее отбросим, если меньше – повторим несколько имён)
const finalNames = [];
for (let i = 0; i < 100; i++) {
  finalNames.push(namesList[i % namesList.length]);
}

// ----------------------------------------------------------------------
// Функция приведения строки к формату "Первая буква заглавная, остальные строчные"
// Например: "harry potter" -> "Harry Potter", "JOHN" -> "John", "pUpUnYa" -> "Pupunya"
// ----------------------------------------------------------------------
function toCapitalized(str) {
  if (!str) return "";
  // Разбиваем на слова по пробелам, каждое слово капитализируем отдельно
  return str
    .split(" ")
    .map((word) => {
      if (word.length === 0) return "";
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

// ----------------------------------------------------------------------
// Основная функция заполнения
// ----------------------------------------------------------------------
async function seedUsers() {
  try {
    // Подключение к MongoDB (локально, через проброшенный порт Docker)
    await mongoose.connect("mongodb://localhost:27017/pazldb", {
      auth: { username: "aleksandr", password: "pazlpass" },
      authSource: "admin",
    });
    console.log("✅ Подключено к MongoDB");

    const users = [];
    for (let rawLogin of finalNames) {
      // Убираем лишние пробелы внутри и по краям
      const cleanLogin = rawLogin.trim().replace(/\s+/g, " ");
      // Пароль: капитализированная версия логина + "123"
      const capitalized = toCapitalized(cleanLogin);
      const rawPassword = capitalized + "123"; // например "Pupunya123", "Harry Potter123"
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      users.push({
        login: cleanLogin,
        password: hashedPassword,
        idRole: roles.USER,
        isDeleted: false,
        deletedAt: null,
        // createdAt/updatedAt добавятся автоматически (timestamps: true)
      });
    }

    // Вставляем всех (ordered: false, чтобы не прерываться на дубликатах)
    await User.insertMany(users, { ordered: false });
    console.log(`✅ Добавлено ${users.length} пользователей.`);
    console.log("Примеры:");
    for (let i = 0; i < Math.min(5, users.length); i++) {
      console.log(
        `   Логин: ${users[i].login} → Пароль: ${toCapitalized(users[i].login)}123`,
      );
    }
    console.log("   ... и т.д. (включая Pupunya)");
    process.exit(0);
  } catch (err) {
    if (err.code === 11000) {
      console.warn(
        "⚠️ Некоторые пользователи уже существуют (конфликт уникальности). Добавлены только новые.",
      );
      process.exit(0);
    } else {
      console.error("❌ Ошибка:", err.message);
      process.exit(1);
    }
  }
}

seedUsers();
