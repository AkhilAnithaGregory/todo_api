const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");

router.get("/todo", todoController.GetTodo);
router.post("/todo", todoController.CreateTodo);
router.put("/todo/:id", todoController.UpdateTodo);
router.delete("/todo/:id", todoController.DeleteTodo);

module.exports = router;
