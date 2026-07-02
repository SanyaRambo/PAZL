const express = require("express");
const multer = require("multer");
const path = require("path");
const authenticated = require("../middlewares/authenticated");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router({ mergeParams: true });

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + path.extname(file.originalname));
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image/")) {
		cb(null, true);
	} else {
		cb(new Error("Можно загружать только изображения"), false);
	}
};

const upload = multer({ storage, fileFilter });

router.post(
	"/",
	authenticated,
	upload.single("image"),
	asyncHandler(async (req, res) => {
		if (!req.file) {
			return res.status(400).json({ res: null, error: "Файл не загружен" });
		}
		res.json({ res: { url: `/uploads/${req.file.filename}` }, error: null });
	})
);

module.exports = router;
