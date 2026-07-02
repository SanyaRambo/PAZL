const express = require("express");
const mapTask = require("../helpers/mapTask");
const {
	getTasks,
	addTask,
	updateTask,
	deleteTask,
} = require("../controllers/task");
const { generateDate } = require("../helpers/dataHelpers");
const authenticated = require("../middlewares/authenticated");
const asyncHandler = require("../middlewares/asyncHandler"); 

const router = express.Router();

router.use(authenticated);

// ==================== GET ====================

router.get(
	"/",
	asyncHandler(async (req, res) => {
		const { search } = req.query;
		const tasks = await getTasks(req.user.id, search || null);

		res.send({
			res: tasks.map((task) => mapTask(task)) || null,
			error: null,
		});
	}),
);

// ==================== POST ====================

router.post(
	"/",
	asyncHandler(async (req, res) => {
		const newTask = await addTask({
			userId: req.user.id,
			title: req.body.title,
			description: req.body.description,
			deadline: req.body.deadline || null,
		});

		res.send({
			res: mapTask(newTask),
			error: null,
		});
	}),
);

// ==================== PATCH ====================

router.patch(
	"/:taskId",
	asyncHandler(async (req, res) => {
		const updatedTask = await updateTask(req.user.id, req.params.taskId, {
			title: req.body.title,
			description: req.body.description,
			updatedAt: generateDate(),
			isDone: req.body.isDone,
			deadline: req.body.deadline || null,
		});

		res.send({
			res: mapTask(updatedTask),
			error: null,
		});
	}),
);

// ==================== DELETE ====================

router.delete(
	"/:taskId",
	asyncHandler(async (req, res) => {
		await deleteTask(req.user.id, req.params.taskId);

		res.send({
			res: null,
			error: null,
		});
	}),
);

module.exports = router;
