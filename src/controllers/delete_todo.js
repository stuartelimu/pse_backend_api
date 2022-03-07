const db = require("../db/db");

module.exports = async function (req, res) {
  try {
    await db.deleteTodo(req.params.id);
    res.json({ message: `Todo ${req.params.id} Deleted` });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
