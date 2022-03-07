const db = require("../db/db");
const TodoItem = require("../models/todo");

module.exports = async function(req, res) {
    const body = req.body;

    if(!body.title) {
        res.status(400).json({message: "No Todo title"});
        return;
    }

    const todo = new TodoItem(null, body.title, false);

    try {
        const result = await db.saveTodo(todo);
        todo.id = result;
        res.json(todo);
    } catch(e) {
        res.status(500).json({ message: e.message })
    }
}