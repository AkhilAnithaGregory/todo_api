const mongoose = require("mongoose");
const Todo = require("../models/todo");

exports.GetTodo = async (req, res) => {
  try {
    const todos = await Todo.find().exec();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.CreateTodo = async (req, res) => {
  try {
    if (!req.body.task && !req.body.isComplete) {
      return res.status(400).json({ message: "Request body is required" });
    }

    const existingTodo = await Todo.findOne({ task: req.body.task });
    if (existingTodo) {
      return res.status(400).json({ message: "Task already exists" });
    }
    const todo = new Todo(req.body);
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.UpdateTodo = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid todo ID" });
    }
    const todo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
    if (!todo) {
      return res.status(404).json({ message: "No todos found" });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.DeleteTodo = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid todo ID" });
    }
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) {
      return res.status(404).json({ message: "No todos found" });
    }
    res.json({ message: "Todo Deleted" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
