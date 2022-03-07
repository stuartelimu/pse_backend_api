const db = require("../db/db");
const todos_per_page = 5;

module.exports = async function (req, res) {
  const result = {};

  try {
    const totalTodos = await db.getSize();

    if (req.query.page) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || todos_per_page;

      const start = (page - 1) * limit;
      const end = page * limit;

      if (end < totalTodos) {
        result.next = {
          page: page + 1,
          limit,
        };
      }

      if (start > 0) {
        result.previous = {
          page: page - 1,
          limit,
        };
      }

      result.results = await db.getTodos(page, limit);
    } else {
      result.results = await db.getTodos();
    }

    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
