const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const tasks = [
  {
    id: 1,
    title: "Estudar Docker",
    done: false
  },
  {
    id: 2,
    title: "Criar pipeline CI/CD",
    done: false
  }
];

app.get("/", (req, res) => {
  res.json({
    message: "DevOps API Project is running!",
    version: "1.0.0"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({
      error: "Task title is required"
    });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    done: false
  };

  tasks.push(newTask);

  return res.status(201).json(newTask);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});