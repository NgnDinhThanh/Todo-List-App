const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let tasks = [];

app.get("/", (req, res) => {
  res.render("index", { tasks: tasks });
});

app.post("/add", (req, res) => {
  let task = req.body.task;
  if (task) tasks.push(task);
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const index = req.body.index;
  tasks.splice(index, 1);
  res.redirect("/");
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
