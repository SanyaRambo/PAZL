require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const path = require("path");
const cors = require("cors");
const corsOptions = {
	origin: [
		"http://localhost:5173",
		"http://localhost",
		"http://localhost:80",
		"http://84.32.97.40",   
		"http://84.32.97.40:80"
	],
	credentials: true,
};

const optionalAuth = require("./middlewares/optionalAuth");

const port = 3001;
const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(optionalAuth);

const frontendPath = path.resolve(__dirname, "../frontend-pazl/dist");
app.use(express.static(frontendPath));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", routes);

app.use((req, res, next) => {
	if (req.path.startsWith("/api")) {
		next();
	} else {
		res.sendFile(path.join(frontendPath, "index.html"));
	}
});

app.use((err, req, res, next) => {
	console.error("❌ Ошибка:", err.message);
	res.status(500).send({
		res: null,
		error:
			err.code === 11000
				? "Такой пользователь уже существует"
				: err.message || "Внутренняя ошибка сервера",
	});
});

mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
	app.listen(port, () => {
		console.log(`Server started on port ${port}`);
	});
});
