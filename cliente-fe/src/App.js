import React, { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setMessage("Inicio de sesión exitoso");
    } else {
      setMessage(data.message);
    }
  };

  const handleProtected = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/protected", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div style={{ margin: "40px", fontFamily: "Arial" }}>
      <h2>Cliente React – Autenticación</h2>
      <input
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        placeholder="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleRegister}>Registrar</button>
      <button onClick={handleLogin}>Iniciar Sesión</button>
      <button onClick={handleProtected}>Ruta Protegida</button>
      <p>{message}</p>
    </div>
  );
}

export default App;