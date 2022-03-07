const express = require("express");

const router = express.Router();

const createTodoController = require("../controllers/create_todo");
const getTodosController = require("../controllers/get_todos");
const updateTodosController = require("../controllers/update_todo");
const deleteTodoController = require("../controllers/delete_todo");

router.get("/todos", getTodosController);
router.post("/todos", createTodoController);
router.put("/todos/:id", updateTodosController);
router.delete("/todos/:id", deleteTodoController);

module.exports = router;