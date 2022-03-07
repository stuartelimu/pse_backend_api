const express = require("express");

const app = express();
app.use(express.json());

// database
const db = require("./db/db");
db.setUp();

// todos
const todos = require("./routes/todos");
app.use("/api/", todos);

const port = process.env.PORT || 5000;

module.exports = app.listen(port, function() { 
  console.log(`API started at http://localhost:${port}`);
});
