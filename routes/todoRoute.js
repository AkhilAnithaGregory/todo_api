const express = require("express");
const router = express.Router();
const {
  GetTodo,
  CreateTodo,
  UpdateTodo,
  DeleteTodo,
} = require("../controllers/todoController");
const { verifyToken } = require("../middleware/auth");

router.get("/", verifyToken, GetTodo);
router.post("/", verifyToken, CreateTodo);
router.put("/:id", verifyToken, UpdateTodo);
router.delete("/:id", verifyToken, DeleteTodo);

module.exports = router;
