const TodoItem = require("../models/todo");

// database connection
const sqlite = require("sqlite3");
const dbName = process.env.NODE_ENV === "test" ? "test" : "todos";
const db = new sqlite.Database(`data/${dbName}.db`);

const todos_table = "todos";



module.exports.setUp = function () {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS ${todos_table} (
	 id INTEGER PRIMARY KEY AUTOINCREMENT,
	 title TEXT,
	 completed INTEGER
	)`,
      function (err) {
        if (err === null) {
          resolve();
        } else {
          reject(err);
        }
      }
    );
  });
};

// Add a todo to the database
module.exports.saveTodo = function (item) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO ${todos_table}(title, completed) VALUES(?,?)`,
      [item.title, item.completed ? 1 : 0],
      function (err) {
        if (err === null) {
          resolve(this.lastID);
        } else {
          reject(err);
        }
      }
    );
  });
};

// update todo
module.exports.updateTodo = async function (id, data) {
  return new Promise((resolve, reject) => {
    console.log(data);

    if (data.title && typeof data.completed === "boolean") {
      db.run(
        `UPDATE ${todos_table} SET title=?, completed=? WHERE id = ?`,
        [data.title, data.completed ? 1 : 0, id],
        function (err) {
          if (err === null) {
            resolve();
          } else {
            reject(err);
          }
        }
      );
    } else if (data.title) {
      // update only title
      db.run(
        `UPDATE ${todos_table} SET title=? WHERE id=?`,
        [data.title, id],
        function (err) {
          if (err === null) {
            resolve();
          } else {
            reject(err);
          }
        }
      );
    } else if (typeof data.completed === "boolean") {
      // update completed
      db.run(
        `UPDATE ${todos_table} SET completed=? WHERE id=?`,
        [data.completed ? 1 : 0, id],
        function (err) {
          if (err === null) {
            console.log(this.changes);
            resolve();
          } else {
            reject(err);
          }
        }
      );
    } else {
      resolve();
    }
  });
};

// delete todo
module.exports.deleteTodo = function (id) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM ${todos_table} WHERE id = ?`, [id], function (err) {
      if (err === null) {
        resolve();
      } else {
        reject(err);
      }
    });
  });
};

// get todos
module.exports.getTodos = async function (page, limit) {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM ${todos_table}`;
    let args = [];

    if (page && limit) {
      const offset = (page - 1) * limit;

      query += " LIMIT ? OFFSET ?";
      args = [limit, offset];
    }

    db.all(query, args, function (err, rows) {
      if (err === null) {
        resolve(
          rows.map(
            (row) => new TodoItem(row.id, row.title, row.completedn === 1)
          )
        );
      } else {
        reject(err);
      }
    });
  });
};

// get todo by id
module.exports.getTodo = async function (id) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM ${todos_table} WHERE ID=?`,
      [id],
      function (err, result) {
        if (err === null) {
          resolve(
            new TodoItem(result.id, result.title, result.completed === 1)
          );
        } else {
          reject(err);
        }
      }
    );
  });
};

// get todo count
module.exports.getSize = async function () {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT COUNT(*) as 'count' FROM ${todos_table}`,
      function (err, result) {
        if (err === null) {
          resolve(result.count);
        } else {
          reject(err);
        }
      }
    );
  });
};
