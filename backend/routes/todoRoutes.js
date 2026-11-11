
import { Router } from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";

import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";

const router = Router();

router.get("/", authMiddleware, getTodos);

router.post("/", authMiddleware, createTodo);

router.put("/:id", authMiddleware, updateTodo);

router.delete("/:id", authMiddleware, deleteTodo);

export default router;