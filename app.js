const express = require("express");
const mongoose = require("mongoose");
const Todo = require("./models/todo");

mongoose.connect("mongodb://localhost/todo");

const app = express();

app.use(express.json());
app.use("/", express.static("./assets"));

app.post("/api/create", async (req, res) => {
  const record = req.body;
  const response = await Todo.create(record);
  console.log(response);
  res.json(response);
});

app.get("/api/get", async (req, res) => {
  res.json(await Todo.find().sort({ date: -1 }));
});

app.post("/api/modify", async (req, res) => {
  const { old: oldTitle, new: newTitle } = req.body;
  const response = await Todo.updateOne(
    { record: oldTitle },
    {
      $set: {
        record: newTitle,
      },
    }
  );
  res.json(response);
  console.log(response);
});

app.delete("/api/delete", async (req, res) => {
  const { record } = req.body;
  const response = await Todo.deleteOne({ record });
  res.json(response);
  console.log(response);
});

app.listen(3000, () => console.log("listenning at http://localhost:3000"));
