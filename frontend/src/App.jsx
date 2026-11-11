
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const [sesion, setSesion] = useState(null);
  const [pantalla, setPantalla] = useState("login");

  const iniciarSesion = (datos) => {
    setSesion(datos);
  };

  const cerrarSesion = () => {
    setSesion(null);
    setPantalla("login");
  };

  if (sesion) {
    return (
      <Dashboard
        usuario={sesion.user}
        token={sesion.access_token}
        cerrarSesion={cerrarSesion}
      />
    );
  }

  return (
    <div>
      {pantalla === "registro" ? (
        <Register volverLogin={() => setPantalla("login")} />
      ) : (
        <Login
          iniciarSesion={iniciarSesion}
          irRegistro={() => setPantalla("registro")}
        />
      )}
    </div>
  );
}

export default App;