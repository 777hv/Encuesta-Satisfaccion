import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5080";

export default function App() {
  const [encuestas, setEncuestas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [error, setError] = useState("");

  async function cargar() {
    try {
      const r = await fetch(`${API}/api/encuestas`);
      setEncuestas(await r.json());
    } catch {
      setError("No se pudo conectar con la API. ¿Está corriendo?");
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function crear(e) {
    e.preventDefault();
    setError("");
    try {
      const r = await fetch(`${API}/api/encuestas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo }),
      });
      if (!r.ok) return setError("Revisa el título de la encuesta.");
      setTitulo("");
      cargar();
    } catch {
      setError("No se pudo conectar con la API.");
    }
  }

  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem", fontFamily: "system-ui" }}>
      <h1>Encuestas de satisfacción</h1>
      <form onSubmit={crear}>
        <label htmlFor="titulo">Título </label>
        <input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        <button type="submit">Crear</button>
      </form>
      {error && <p role="alert">{error}</p>}
      <ul>
        {encuestas.map((e) => (
          <li key={e.id}>{e.titulo}</li>
        ))}
      </ul>
    </main>
  );
}
