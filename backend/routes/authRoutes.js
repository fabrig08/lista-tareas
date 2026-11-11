
import { Router } from "express";

import {
  register,
  login,
} from "../controllers/authController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Usuario autenticado correctamente",
    user: {
      id: req.user.id,
      email: req.user.email,
    },
  });
});

export default router;