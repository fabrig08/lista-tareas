
import { useState } from "react";
import { loginUsuario } from "../services/api";

function Login({ iniciarSesion, irRegistro }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cargando) return;

    setMensaje("");
    setCargando(true);

    try {
      const datos = await loginUsuario(email, password);

      // Guardar la sesión en App.jsx
      iniciarSesion(datos);
    } catch (error) {
      setMensaje(error.message || "No se pudo iniciar sesión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Lista de Tareas</h1>
      <h2>Iniciar sesión</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Correo electrónico</label>

          <input
            id="email"
            type="email"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>

          <div
            style={{
              position: "relative",
              width: "100%",
              margin: 0,
            }}
          >
            <input
              id="password"
              type={mostrarPassword ? "text" : "password"}
              placeholder="Ingresá tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              style={{
                width: "100%",
                paddingRight: "50px",
              }}
            />

            <button
              type="button"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              aria-label={
                mostrarPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
              aria-pressed={mostrarPassword}
              title={
                mostrarPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "none",
                color: "#ffffff",
                padding: "6px",
                margin: 0,
                cursor: "pointer",
              }}
            >
              {mostrarPassword ? (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 3l18 18" />
                  <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
                  <path d="M9.9 5.2A10 10 0 0 1 12 5c5 0 9 4 10 7a14 14 0 0 1-3.1 4.5" />
                  <path d="M6.2 6.2C3.9 7.6 2.5 10 2 12c1 3 5 7 10 7 1.8 0 3.5-.5 4.9-1.4" />
                </svg>
              ) : (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button type="submit" disabled={cargando}>
          {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>

      {mensaje && <p role="alert">{mensaje}</p>}

      
      <div className="login-registro">
      <p>¿No tenés cuenta?</p>

      <button type="button" onClick={irRegistro}>
      Registrarse
      </button>
      </div>

    </div>
  );
}

export default Login;