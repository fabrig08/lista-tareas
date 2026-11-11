
import Todos from "./Todos";

function Dashboard({ usuario, token, cerrarSesion }) {
  return (
    <main>
      <Todos
        usuario={usuario}
        token={token}
        cerrarSesion={cerrarSesion}
      />
    </main>
  );
}

export default Dashboard;