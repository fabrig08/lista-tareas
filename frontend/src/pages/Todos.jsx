
import { useEffect, useState } from "react";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import {
  obtenerTareas,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
    } from "../services/api";



    function Todos({ usuario, token, cerrarSesion }) {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  
  const [filtros, setFiltros] = useState({
        completada: "todas",
        prioridad: "todas",
        orden: "asc",
        });


  // Datos del formulario
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState("Media");
  const [vencimiento, setVencimiento] = useState("");

  const [creando, setCreando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [actualizandoId, setActualizandoId] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [eliminandoId, setEliminandoId] = useState(null);
  const [edicion, setEdicion] = useState({
    Titulo: "",
    Descripcion: "",
    Prioridad: "Media",
    Vencimiento: "",
    });

 const [guardando, setGuardando] = useState(false);
 const [errorEdicion, setErrorEdicion] = useState("");


  // Obtener las tareas cuando se abre la pantalla
  
    useEffect(() => {
    let activo = true;

    async function cargarTareas() {
    setCargando(true);
    setError("");

    try {
      const datos = await obtenerTareas(token, filtros);

      if (activo) {
        setTareas(datos);
      }
    } catch (error) {
      if (activo) {
        setError(error.message);
      }
    } finally {
      if (activo) {
        setCargando(false);
      }
    }
    }

    cargarTareas();

    return () => {
    activo = false;
    };
    }, [token, filtros]);

    const refrescarTareas = async () => {
    const datos = await obtenerTareas(token, filtros);
    setTareas(datos);
    };


  // Crear una nueva tarea
  const handleCrearTarea = async (e) => {
    e.preventDefault();

    setMensaje("");
    setCreando(true);

    try {
      const nuevaTarea = {
        Titulo: titulo,
        Descripcion: descripcion,
        Prioridad: prioridad,
        Vencimiento: vencimiento,
      };

      
        await crearTarea(token, nuevaTarea);

        const tareasActualizadas = await obtenerTareas(token, filtros);

        setTareas(tareasActualizadas);


      // Limpiar el formulario
      setTitulo("");
      setDescripcion("");
      setPrioridad("Media");
      setVencimiento("");

      setMensaje("Tarea creada correctamente");
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setCreando(false);
    }
    };

    const handleCompletarTarea = async (tarea) => {
     setMensaje("");
    setActualizandoId(tarea.id);

    try {
    
    await actualizarTarea(token, tarea.id, {
    Completada: !tarea.Completada,
        });

     await refrescarTareas();

    } catch (error) {
    setMensaje(error.message);
    } finally {
    setActualizandoId(null);
    }
    };

    const iniciarEdicion = (tarea) => {
  setErrorEdicion("");
  setEditandoId(tarea.id);

  setEdicion({
    Titulo: tarea.Titulo,
    Descripcion: tarea.Descripcion || "",
    Prioridad: tarea.Prioridad,
    Vencimiento: tarea.Vencimiento || "",
  });
    };

    const cancelarEdicion = () => {
  setEditandoId(null);
  setErrorEdicion("");
    };

    const guardarEdicion = async (e) => {
  e.preventDefault();

  if (editandoId === null || guardando) return;

  setErrorEdicion("");
  setGuardando(true);

  try {
   
    await actualizarTarea(token, editandoId, edicion);

    await refrescarTareas();


    setEditandoId(null);
    setMensaje("Tarea actualizada correctamente");
  } catch (error) {
    setErrorEdicion(error.message);
  } finally {
    setGuardando(false);
  }
    };

    const handleEliminarTarea = async (tarea) => {
    const confirmar = window.confirm(
    `¿Seguro que querés eliminar "${tarea.Titulo}"?`
    );

  if (!confirmar) return;

  setMensaje("");
  setEliminandoId(tarea.id);

  try {
    await eliminarTarea(token, tarea.id);

    setTareas((anteriores) =>
      anteriores.filter((actual) => actual.id !== tarea.id)
    );

    setMensaje("Tarea eliminada correctamente");
  } catch (error) {
    setMensaje(error.message);
  } finally {
    setEliminandoId(null);
  }
        };




  return (
    <div>
      <h1>Lista de Tareas</h1>

      <p>Bienvenido: {usuario.email}</p>

      <button onClick={cerrarSesion}>
        Cerrar sesión
      </button>

      <hr />

      <h2>Crear nueva tarea</h2>

      <TodoForm
        titulo={titulo}
        setTitulo={setTitulo}
        descripcion={descripcion}
        setDescripcion={setDescripcion}
        prioridad={prioridad}
        setPrioridad={setPrioridad}
        vencimiento={vencimiento}
        setVencimiento={setVencimiento}
        handleCrearTarea={handleCrearTarea}
        creando={creando}
      />


      {mensaje && <p role="status">{mensaje}</p>}

      <hr />

      <h2>Mis Tareas</h2>

    <div>
    <label htmlFor="filtro-estado">
    Filtrar por estado
    </label>

    <select
    id="filtro-estado"
    value={filtros.completada}
    onChange={(e) =>
      setFiltros({
        ...filtros,
        completada: e.target.value,
      })
     }
     >
    <option value="todas">Todas</option>
    <option value="false">Pendientes</option>
    <option value="true">Completadas</option>
    </select>
        </div>

    <div> 
  <label htmlFor="filtro-prioridad">
    Filtrar por prioridad
  </label>

  <select
    id="filtro-prioridad"
    value={filtros.prioridad}
    onChange={(e) =>
      setFiltros({
        ...filtros,
        prioridad: e.target.value,
      })
    }
  >
    <option value="todas">Todas</option>
    <option value="Alta">Alta</option>
    <option value="Media">Media</option>
    <option value="Baja">Baja</option>
  </select>
    </div>

    <div>
  <label htmlFor="filtro-orden">
    Ordenar por vencimiento
  </label>

    <select
    id="filtro-orden"
    value={filtros.orden}
    onChange={(e) =>
      setFiltros({
        ...filtros,
        orden: e.target.value,
      })
    }
    >
    <option value="asc">Más próximas primero</option>
    <option value="desc">Más lejanas primero</option>
    </select>
    </div>

      {cargando && <p>Cargando tareas...</p>}

      {error && <p role="alert">Error: {error}</p>}

      {!cargando && !error && tareas.length === 0 && (
        <p>Todavía no tenés tareas registradas.</p>
      )}

      {!cargando && !error && tareas.length > 0 && (
        
      <TodoList
      tareas={tareas}
      actualizandoId={actualizandoId}
      eliminandoId={eliminandoId}
      editandoId={editandoId}
      edicion={edicion}
      setEdicion={setEdicion}
      guardando={guardando}
      errorEdicion={errorEdicion}
      handleCompletarTarea={handleCompletarTarea}
      iniciarEdicion={iniciarEdicion}
      handleEliminarTarea={handleEliminarTarea}
      guardarEdicion={guardarEdicion}
      cancelarEdicion={cancelarEdicion}
      />

      )}
    </div>
  );
}

export default Todos;