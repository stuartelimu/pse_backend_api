const express = require("express");

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!')
});

const port = process.env.PORT || 5000

module.exports = app.listen(port, function() { 
  console.log(`API started at http://localhost:${port}`);
});
