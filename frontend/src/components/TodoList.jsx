
import TodoItem from "./TodoItem";

function TodoList({
  tareas,
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
  return (
    <ul>
      {tareas.map((tarea) => (
        <TodoItem
          key={tarea.id}
          tarea={tarea}
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
      ))}
    </ul>
  );
}

export default TodoList;