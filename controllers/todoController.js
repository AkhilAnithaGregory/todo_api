const Todo = require("../models/todo");

exports.GetTodo = async (req, res) => {
  try {
    const todos = await Todo.find().exec();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
    res.status(404).json({ message: "No todos found" });
  }
};

exports.CreateTodo = async (req, res) => {
  try {
    const todo = new Todo(req.body);
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
    res.status(400).json({ message: error.message });
    res.status(404).json({ message: error.message });
    console.log("res", res);
  }
};

exports.UpdateTodo = async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
    res.status(400).json({ message: error.message });
    res.status(404).json({ message: "No todos found" });
  }
};

exports.DeleteTodo = async (req, res) => {
  try {
    const id = req.params.id;
    await Todo.findByIdAndDelete(id);
    res.json({ message: "Todo Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    res.status(404).json({ message: "No todos found" });
  }
};
