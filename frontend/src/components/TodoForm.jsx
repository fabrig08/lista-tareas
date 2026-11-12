
function TodoForm({
  titulo,
  setTitulo,
  descripcion,
  setDescripcion,
  prioridad,
  setPrioridad,
  vencimiento,
  setVencimiento,
  handleCrearTarea,
  creando,
}) {
  const hoy = new Date(
    Date.now() - new Date().getTimezoneOffset() * 60000
  ).toISOString().split("T")[0];

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin seleccionar";

    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
  };

  return (
    <div className="todo-crear-layout">
      <section className="todo-crear-panel">
        <h3>Nueva tarea</h3>
        <p>Completá los datos para organizar tu actividad.</p>

        <form onSubmit={handleCrearTarea}>
          <div>
            <label htmlFor="titulo">Título</label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Estudiar programación"
              required
            />
          </div>

          <div>
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Agregá información adicional..."
            />
          </div>

          <div>
            <label htmlFor="prioridad">Prioridad</label>
            <select
              id="prioridad"
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value)}
            >
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

          <div>
            <label htmlFor="vencimiento">
              Fecha de vencimiento
            </label>
            <input
              id="vencimiento"
              type="date"
              min={hoy}
              value={vencimiento}
              onChange={(e) => setVencimiento(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={creando}>
            {creando ? "Creando..." : "Crear tarea"}
          </button>
        </form>
      </section>

      <aside className="todo-vista-previa">
        <div className="todo-previa-encabezado">
          <h3>Vista previa</h3>
          <span>Tu nueva tarea</span>
        </div>

        <div className="todo-previa-tarjeta">
          <h4>{titulo.trim() || "Título de tu tarea"}</h4>

          <p>
            {descripcion.trim() ||
              "La descripción aparecerá aquí."}
          </p>

          <div className="todo-previa-datos">
            <span className={`prioridad-${prioridad.toLowerCase()}`}>
              {prioridad}
            </span>

            <span>{formatearFecha(vencimiento)}</span>
          </div>

          <div className="todo-previa-estado">
            <span className="todo-punto-pendiente" />
            Pendiente
          </div>
        </div>

        <p className="todo-previa-ayuda">
          La vista previa cambia mientras completás el formulario.
          Al crear la tarea, se guardará en tu lista.
        </p>
      </aside>
    </div>
  );
}

export default TodoForm;