
import supabase from "../config/supabase.js";
import { createClient } from "@supabase/supabase-js";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "El correo y la contraseña son obligatorios",
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      if (error.status === 422) {
        return res.status(400).json({
          message: "Revisá el correo y la contraseña ingresados",
        });
      }

      console.error("Error de registro:", error.message);

      return res.status(400).json({
        message: "No se pudo completar el registro",
      });
    }

    return res.status(201).json({
      message: "Solicitud de registro procesada. Revisá tu correo si se requiere confirmación.",
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
      requiereConfirmacion: !data.session,
    });

  } catch (error) {
    console.error("Error inesperado en el registro:", error);

    return res.status(500).json({
      message: "Ocurrió un error interno del servidor",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "El correo y la contraseña son obligatorios",
      });
    }

    const authClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );

    const { data, error } =
      await authClient.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (error) {
      return res.status(401).json({
        message: "Credenciales inválidas o correo sin confirmar",
      });
    }

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      access_token: data.session.access_token,
      expires_in: data.session.expires_in,
    });

  } catch (error) {
    console.error("Error inesperado en login:", error.message);

    return res.status(500).json({
      message: "Ocurrió un error interno del servidor",
    });
  }
};
