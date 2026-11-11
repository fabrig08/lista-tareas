
import supabase from "../config/supabase.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        message: "No se proporcionó un token de autenticación",
      });
    }

    const parts = authorization.split(" ");

    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer" ||
      !parts[1]
    ) {
      return res.status(401).json({
        message: "Formato de token inválido",
      });
    }

    const token = parts[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        message: "Token inválido o expirado",
      });
    }

    req.user = data.user;
    req.accessToken = token;

    next();

  } catch (error) {
    console.error("Error al verificar la autenticación:", error.message);

    return res.status(500).json({
      message: "Error interno al verificar la autenticación",
    });
  }
};