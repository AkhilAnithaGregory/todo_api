const mongoose = require("mongoose");
const Todo = require("../models/todo");
const jwt = require("jsonwebtoken");

exports.GetTodo = async (req, res) => {
  const { date } = req.query;
  const userId = req.headers["authorization"];

  if (!date) {
    return res.status(400).json({ message: "Date is required" });
  }

  if (!userId) {
    return res
      .status(400)
      .json({ message: "User ID is required in the header" });
  }

  try {
    const decoded = jwt.decode(userId);
    if (!decoded || !decoded.user || !decoded.user.id) {
      return res
        .status(400)
        .json({ message: "Invalid token or user ID not found" });
    }

    const userIdFromToken = decoded.user.id;

    const todos = await Todo.find({ date, user: userIdFromToken });

    if (todos.length === 0) {
      return res.status(404).json({ message: "No todos found for this date" });
    }

    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.CreateTodo = async (req, res) => {
  const { task, description, isComplete, date } = req.body;
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(400).json({ message: "Authorization token is required" });
  }

  try {
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.user || !decoded.user.id) {
      return res
        .status(400)
        .json({ message: "Invalid token or user ID not found" });
    }

    const userId = decoded.user.id;

    if (!task || !date) {
      return res.status(400).json({ message: "Task and Date are required" });
    }

    const existingTodo = await Todo.findOne({ task, date, user: userId });
    if (existingTodo) {
      return res
        .status(400)
        .json({ message: "Task already exists for this day" });
    }

    const todo = new Todo({
      task,
      description,
      isComplete,
      date,
      user: userId,
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.UpdateTodo = async (req, res) => {
  const { id } = req.params;
  const { task, isComplete, date, description } = req.body;
  const { dateQuery } = req.query;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid todo ID" });
    }

    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (dateQuery) {
      const todoDate = todo.date.toISOString().split("T")[0];
      if (todoDate !== dateQuery) {
        return res
          .status(400)
          .json({ message: "Todo does not match the specified date" });
      }
    }

    todo.task = task || todo.task;
    todo.isComplete = isComplete !== undefined ? isComplete : todo.isComplete;
    todo.date = date || todo.date;
    todo.description = description || todo.description;

    await todo.save();
    res.json(todo);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.DeleteTodo = async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid todo ID" });
    }

    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (date) {
      const todoDate = todo.date.toISOString().split("T")[0];
      if (todoDate !== date) {
        return res
          .status(400)
          .json({ message: "Todo does not match the specified date" });
      }
    }

    await Todo.findByIdAndDelete(id);
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
