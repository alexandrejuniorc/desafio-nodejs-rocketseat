const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const usernameExists = users.find((user) => user.username === username);

  if (!usernameExists) {
    return response.status(400).send({ error: "User not found!" });
  }

  request.usernameExists = usernameExists;
  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.some((user) => user.username === username);
  if (userAlreadyExists) {
    return response.status(400).json({ message: "User already exists" });
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: [],
  });

  return response.status(201).json({ message: "Successfully added user" });
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { usernameExists } = request;
  return response.json(usernameExists.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { usernameExists } = request;
  const { title, deadline } = request.body;

  const todoCreated = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  usernameExists.todos.push(todoCreated);

  return response.status(201).json({ message: "Successfully added todo" });
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { usernameExists } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todoUpdated = usernameExists.todos.find((todo) => todo.id === id);

  todoUpdated.title = title;
  todoUpdated.deadline = new Date(deadline);

  return response.status(201).json(todoUpdated);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
