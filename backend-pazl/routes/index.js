const express = require("express");

const router = express.Router({ mergeParams: true });

router.use("/", require("./auth"));
router.use("/publications", require("./post"));
router.use("/media-library", require("./mediaLibrary"));
router.use("/workshop", require("./workshop"));
router.use("/login", require("./user"));
router.use("/register", require("./user"));
router.use("/task", require("./task"));
router.use("/options", require("./user"));
router.use("/profile-user", require("./user"));
router.use("/friends-and-communities", require("./user"));
router.use("/friends", require("./friend"));
router.use("/user-stats", require('./userStats'))
router.use("/upload", require("./upload"));
router.use("/me", require("./auth"));

module.exports = router;
