const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  task: { type: String, required: true, unique: true },
  description: { type: String },
  isComplete: { type: Boolean, required: true },
});

const Todo = mongoose.model("TodoSchema", TodoSchema);

module.exports = Todo;
