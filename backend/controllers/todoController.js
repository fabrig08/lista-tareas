
import { createClient } from "@supabase/supabase-js";

// ==========================================
// GET - Obtener las tareas del usuario
// ==========================================

export const getTodos = async (req, res) => {
  try {
    const { completada, prioridad, orden } = req.query;

    // Validar el filtro de estado
    if (
      completada !== undefined &&
      completada !== "true" &&
      completada !== "false"
    ) {
      return res.status(400).json({
        message: "El filtro completada debe ser true o false",
      });
    }

    // Validar el filtro de prioridad
    if (
      prioridad !== undefined &&
      !["Alta", "Media", "Baja"].includes(prioridad)
    ) {
      return res.status(400).json({
        message: "La prioridad debe ser Alta, Media o Baja",
      });
    }
    if (
       orden !== undefined &&
      orden !== "asc" &&
      orden !== "desc"
    ) {
  return res.status(400).json({
    message: "El orden debe ser asc o desc",
  });
}

    // Crear un cliente autenticado de Supabase
    const supabaseUsuario = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${req.accessToken}`,
          },
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );

    // Preparar la consulta de tareas
    let consulta = supabaseUsuario
      .from("Todos")
      .select("*")
      .eq("user_id", req.user.id);

    // Aplicar el filtro de estado
    if (completada !== undefined) {
      consulta = consulta.eq(
        "Completada",
        completada === "true"
      );
    }

    // Aplicar el filtro de prioridad
    if (prioridad !== undefined) {
      consulta = consulta.eq("Prioridad", prioridad);
    }
    
    if (orden !== undefined) {
      consulta = consulta.order("Vencimiento", {
      ascending: orden === "asc",
      nullsFirst: false,
    });
    }

    // Ejecutar la consulta
    const { data, error } = await consulta;

    if (error) {
      console.error("Error al consultar tareas:", error.message);

      return res.status(500).json({
        message: "No se pudieron obtener las tareas",
      });
    }

    return res.status(200).json({
      message: "Tareas obtenidas correctamente",
      tareas: data,
    });

  } catch (error) {
    console.error("Error inesperado:", error.message);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// ==========================================
// POST - Crear una nueva tarea
// ==========================================

export const createTodo = async (req, res) => {
  try {
    const { Titulo, Descripcion, Prioridad, Vencimiento } =
      req.body ?? {};

    // Validar el título
    if (typeof Titulo !== "string" || !Titulo.trim()) {
      return res.status(400).json({
        message: "El título de la tarea es obligatorio",
      });
    }

    // Validar la prioridad
    if (!["Baja", "Media", "Alta"].includes(Prioridad)) {
      return res.status(400).json({
        message: "La prioridad debe ser Baja, Media o Alta",
      });
    }

    // Validar la descripción
    if (
      Descripcion !== undefined &&
      typeof Descripcion !== "string"
    ) {
      return res.status(400).json({
        message: "La descripción debe ser un texto",
      });
    }

    // Validar la fecha de vencimiento
    const fechaValida =
      typeof Vencimiento === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(Vencimiento) &&
      !Number.isNaN(Date.parse(Vencimiento)) &&
      new Date(Vencimiento).toISOString().slice(0, 10) === Vencimiento;

    if (!fechaValida) {
      return res.status(400).json({
        message: "Ingresá una fecha válida con formato AAAA-MM-DD",
      });
    }

    const hoy = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
    });

    if (Vencimiento < hoy) {
      return res.status(400).json({
      message: "La fecha de vencimiento no puede ser anterior a hoy",
      });
    }

    // Crear un cliente autenticado de Supabase
    const supabaseUsuario = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${req.accessToken}`,
          },
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );

    // Preparar los datos de la nueva tarea
    const nuevaTarea = {
      Titulo: Titulo.trim(),
      Descripcion: Descripcion?.trim() ?? "",
      Prioridad,
      Vencimiento,
      Completada: false,
      Creacion: new Date().toISOString().slice(0, 19),
      user_id: req.user.id,
    };

    // Guardar la tarea en Supabase
    const { data, error } = await supabaseUsuario
      .from("Todos")
      .insert(nuevaTarea)
      .select()
      .single();

    if (error) {
      console.error("Error al crear tarea:", error.message);

      return res.status(500).json({
        message: "No se pudo crear la tarea",
      });
    }

    return res.status(201).json({
      message: "Tarea creada correctamente",
      tarea: data,
    });

  } catch (error) {
    console.error("Error inesperado:", error.message);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// ==========================================
// PUT - Modificar una tarea existente
// ==========================================

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const tareaId = Number(id);

    // Validar el ID
    if (
      !Number.isSafeInteger(tareaId) ||
      tareaId <= 0
    ) {
      return res.status(400).json({
        message: "El ID de la tarea no es válido",
      });
    }

    // Columnas que permitimos modificar
    const camposPermitidos = [
      "Titulo",
      "Descripcion",
      "Prioridad",
      "Vencimiento",
      "Completada",
    ];

    const cambios = req.body;

    // Comprobar que se enviaron datos
    if (
      !cambios ||
      typeof cambios !== "object" ||
      Array.isArray(cambios)
    ) {
      return res.status(400).json({
        message: "Debés enviar los datos de la tarea",
      });
    }

    const camposEnviados = Object.keys(cambios);

    if (camposEnviados.length === 0) {
      return res.status(400).json({
        message: "No se enviaron cambios",
      });
    }

    // Impedir cambios en columnas protegidas
    const camposInvalidos = camposEnviados.filter(
      campo => !camposPermitidos.includes(campo)
    );

    if (camposInvalidos.length > 0) {
      return res.status(400).json({
        message: "Se enviaron campos que no se pueden modificar",
      });
    }

    // Validar título
    if ("Titulo" in cambios) {
      if (
        typeof cambios.Titulo !== "string" ||
        !cambios.Titulo.trim()
      ) {
        return res.status(400).json({
          message: "El título no puede estar vacío",
        });
      }

      cambios.Titulo = cambios.Titulo.trim();
    }

    // Validar descripción
    if ("Descripcion" in cambios) {
      if (typeof cambios.Descripcion !== "string") {
        return res.status(400).json({
          message: "La descripción debe ser un texto",
        });
      }

      cambios.Descripcion = cambios.Descripcion.trim();
    }

    // Validar prioridad
    if ("Prioridad" in cambios) {
      if (
        !["Baja", "Media", "Alta"].includes(cambios.Prioridad)
      ) {
        return res.status(400).json({
          message: "La prioridad debe ser Baja, Media o Alta",
        });
      }
    }

    // Validar fecha de vencimiento
    if ("Vencimiento" in cambios) {
      const fecha = cambios.Vencimiento;

      const fechaValida =
        typeof fecha === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(fecha) &&
        !Number.isNaN(Date.parse(fecha)) &&
        new Date(fecha).toISOString().slice(0, 10) === fecha;

      if (!fechaValida) {
        return res.status(400).json({
          message: "La fecha debe tener formato AAAA-MM-DD",
        });
      }
    }

    // Validar estado de la tarea
    if ("Completada" in cambios) {
      if (typeof cambios.Completada !== "boolean") {
        return res.status(400).json({
          message: "Completada debe ser true o false",
        });
      }
    }

    // Crear un cliente autenticado de Supabase
    const supabaseUsuario = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${req.accessToken}`,
          },
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );

    // Actualizar únicamente una tarea propia
    const { data, error } = await supabaseUsuario
      .from("Todos")
      .update(cambios)
      .eq("id", tareaId)
      .eq("user_id", req.user.id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error al actualizar tarea:", error.message);

      return res.status(500).json({
        message: "No se pudo actualizar la tarea",
      });
    }

    if (!data) {
      return res.status(404).json({
        message: "Tarea no encontrada",
      });
    }

    return res.status(200).json({
      message: "Tarea actualizada correctamente",
      tarea: data,
    });

  } catch (error) {
    console.error("Error inesperado:", error.message);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// ==========================================
// DELETE - Eliminar una tarea
// ==========================================

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const tareaId = Number(id);

    // Validar el ID
    if (
      !Number.isSafeInteger(tareaId) ||
      tareaId <= 0
    ) {
      return res.status(400).json({
        message: "El ID de la tarea no es válido",
      });
    }

    // Crear un cliente autenticado de Supabase
    const supabaseUsuario = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${req.accessToken}`,
          },
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );

    // Eliminar únicamente una tarea propia
    const { data, error } = await supabaseUsuario
      .from("Todos")
      .delete()
      .eq("id", tareaId)
      .eq("user_id", req.user.id)
      .select("id, Titulo")
      .maybeSingle();

    if (error) {
      console.error("Error al eliminar tarea:", error.message);

      return res.status(500).json({
        message: "No se pudo eliminar la tarea",
      });
    }

    if (!data) {
      return res.status(404).json({
        message: "Tarea no encontrada",
      });
    }

    return res.status(200).json({
      message: "Tarea eliminada correctamente",
      tareaEliminada: data,
    });

  } catch (error) {
    console.error("Error inesperado al eliminar:", error.message);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};
