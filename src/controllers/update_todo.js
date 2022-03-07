const db = require("../db/db");

module.exports = async function (req, res) {
  try {
    await db.updateTodo(req.params.id, req.body);
    res.json({ message: `TODO ${req.params.id} Updated` });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
