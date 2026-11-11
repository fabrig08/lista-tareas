
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

  return (
    <form onSubmit={handleCrearTarea}>
      <div>
        <label htmlFor="titulo">Título</label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
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
  );
}

export default TodoForm;