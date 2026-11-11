
import { useState } from "react";
import { registrarUsuario } from "../services/api";

function Register({ volverLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cargando) return;

    setMensaje("");
    setError("");

    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setCargando(true);

    try {
      await registrarUsuario(email, password);

      setMensaje(
        "Registro realizado. Revisá tu correo electrónico para confirmar tu cuenta."
      );

      setEmail("");
      setPassword("");
      setConfirmarPassword("");
    } catch (error) {
      setError(error.message || "No se pudo crear la cuenta");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Lista de Tareas</h1>
      <h2>Crear cuenta</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="registro-email">
            Correo electrónico
          </label>
          <input
            id="registro-email"
            type="email"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="registro-password">
            Contraseña
          </label>
          <input
            id="registro-password"
            type={mostrarPassword ? "text" : "password"}
            placeholder="Ingresá una contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>

        <div>
          <label htmlFor="registro-confirmar">
            Confirmar contraseña
          </label>
          <input
            id="registro-confirmar"
            type={mostrarPassword ? "text" : "password"}
            placeholder="Repetí la contraseña"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "18px",
          }}
        >
          <input
            type="checkbox"
            checked={mostrarPassword}
            onChange={(e) => setMostrarPassword(e.target.checked)}
          />
          Mostrar contraseñas
        </label>

        <button type="submit" disabled={cargando}>
          {cargando ? "Registrando..." : "Crear cuenta"}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}
      {mensaje && <p role="status">{mensaje}</p>}

      <p>
        ¿Ya tenés una cuenta?
      </p>

      <button type="button" onClick={volverLogin}>
        Volver a iniciar sesión
      </button>
    </div>
  );
}

export default Register;