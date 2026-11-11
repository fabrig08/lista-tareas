
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function loginUsuario(email, password) {
  const respuesta = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.message || "Error al iniciar sesión");
  }

  return datos;
}


export async function obtenerTareas(token, filtros = {}) {
  const parametros = new URLSearchParams();

  if (filtros.completada !== "todas") {
    parametros.append("completada", filtros.completada);
  }

  if (filtros.prioridad !== "todas") {
    parametros.append("prioridad", filtros.prioridad);
  }

  if (filtros.orden) {
    parametros.append("orden", filtros.orden);
  }

  const url = `${API_URL}/api/todos?${parametros.toString()}`;

  const respuesta = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message || "No se pudieron obtener las tareas"
    );
  }

  return datos.tareas;
}

export async function crearTarea(token, nuevaTarea) {
  const respuesta = await fetch(`${API_URL}/api/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(nuevaTarea),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message || "No se pudo crear la tarea"
    );
  }

  return datos.tarea;
}

export async function actualizarTarea(token, id, cambios) {
  const respuesta = await fetch(`${API_URL}/api/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cambios),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message || "No se pudo actualizar la tarea"
    );
  }

  return datos.tarea;
}

export async function eliminarTarea(token, id) {
  const respuesta = await fetch(`${API_URL}/api/todos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message || "No se pudo eliminar la tarea"
    );
  }

  return datos;
}

export async function registrarUsuario(email, password) {
  const respuesta = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message || "No se pudo registrar el usuario"
    );
  }

  return datos;
}
