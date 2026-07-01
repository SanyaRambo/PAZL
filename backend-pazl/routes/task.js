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

const router = express.Router();

router.use(authenticated);

router.get("/", async (req, res) => {
	try {
		const { search } = req.query;
		const tasks = await getTasks(req.user.id, search || null);

		res.send({
			res: tasks.map((task) => mapTask(task)) || null,
			error: null,
		});
	} catch (e) {
		res.send({
			res: null,
			error: e.message,
		});
	}
});

router.post("/", async (req, res) => {
	try {
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
	} catch (e) {
		res.send({
			res: null,
			error: e.message,
		});
		console.log(e.message);
	}
});

router.patch("/:taskId", async (req, res) => {
	try {
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
	} catch (e) {
		res.send({
			res: null,
			error: e.message,
		});
		console.log(e.message);
	}
});

router.delete("/:taskId", async (req, res) => {
	try {
		const deletedTask = await deleteTask(req.user.id, req.params.taskId);

		res.send({
			res: null,
			error: null,
		});
	} catch (e) {
		res.send({
			res: null,
			error: e.message,
		});
	}
});

module.exports = router;
