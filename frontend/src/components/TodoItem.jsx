
function TodoItem({
  tarea,
  actualizandoId,
  eliminandoId,
  editandoId,
  edicion,
  setEdicion,
  guardando,
  errorEdicion,
  handleCompletarTarea,
  iniciarEdicion,
  handleEliminarTarea,
  guardarEdicion,
  cancelarEdicion,
}) {
  const hoy = new Date(
    Date.now() - new Date().getTimezoneOffset() * 60000
  ).toISOString().split("T")[0];

  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={tarea.Completada === true}
          onChange={() => handleCompletarTarea(tarea)}
          disabled={actualizandoId !== null}
        />

        <span
          style={{
            textDecoration: tarea.Completada
              ? "line-through"
              : "none",
          }}
        >
          {tarea.Titulo}
        </span>
      </label>

      <p>
        Descripción: {tarea.Descripcion || "Sin descripción"}
      </p>

      <p>Prioridad: {tarea.Prioridad}</p>

      <p>
        Vencimiento: {tarea.Vencimiento || "Sin fecha"}
      </p>

      <p>
        Estado: {tarea.Completada ? "Completada" : "Pendiente"}
      </p>

      <button
        type="button"
        onClick={() => iniciarEdicion(tarea)}
        disabled={actualizandoId !== null || guardando}
      >
        Editar
      </button>

      <button
        type="button"
        onClick={() => handleEliminarTarea(tarea)}
        disabled={
          eliminandoId !== null ||
          actualizandoId !== null ||
          guardando
        }
      >
        {eliminandoId === tarea.id ? "Eliminando..." : "Eliminar"}
      </button>

      {editandoId === tarea.id && (
        <form onSubmit={guardarEdicion}>
          <h4>Editar tarea</h4>

          <div>
            <label>Título</label>
            <input
              type="text"
              value={edicion.Titulo}
              onChange={(e) =>
                setEdicion({
                  ...edicion,
                  Titulo: e.target.value,
                })
              }
              required
            />
          </div>

          <div>
            <label>Descripción</label>
            <textarea
              value={edicion.Descripcion}
              onChange={(e) =>
                setEdicion({
                  ...edicion,
                  Descripcion: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label>Prioridad</label>
            <select
              value={edicion.Prioridad}
              onChange={(e) =>
                setEdicion({
                  ...edicion,
                  Prioridad: e.target.value,
                })
              }
            >
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

          <div>
            <label>Fecha de vencimiento</label>
            <input
              type="date"
              min={hoy}
              value={edicion.Vencimiento}
              onChange={(e) =>
                setEdicion({
                  ...edicion,
                  Vencimiento: e.target.value,
                })
              }
              required
            />
          </div>

          {errorEdicion && (
            <p role="alert">{errorEdicion}</p>
          )}

          <button type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>

          <button
            type="button"
            onClick={cancelarEdicion}
            disabled={guardando}
          >
            Cancelar
          </button>
        </form>
      )}

      <hr />
    </li>
  );
}

export default TodoItem;