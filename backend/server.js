
import express from "express";
import cors from "cors";
import "./config/supabase.js";

import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://lista-tareas-frontend.onrender.com"
    ],  
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API de lista de tareas funcionando",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});