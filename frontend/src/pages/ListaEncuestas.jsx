import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

export default function ListaEncuestas() {
  const [encuestas, setEncuestas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [error, setError] = useState("");

  async function cargar() {
    try {
      setEncuestas(await api.listarEncuestas());
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function crear(e) {
    e.preventDefault();
    setError("");
    try {
      await api.crearEncuesta({ titulo });
      setTitulo("");
      cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  async function eliminar(encuesta) {
    if (!confirm(`¿Eliminar "${encuesta.titulo}" con todas sus preguntas y respuestas?`)) return;
    try {
      await api.eliminarEncuesta(encuesta.id);
      cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <h1>Encuestas de satisfacción</h1>

      <form onSubmit={crear}>
        <label htmlFor="titulo">Título </label>
        <input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        <button type="submit">Crear</button>
      </form>

      {error && <p role="alert">{error}</p>}

      <ul>
        {encuestas.map((e) => (
          <li key={e.id}>
            <Link to={`/encuestas/${e.id}`}>{e.titulo}</Link>{" "}
            {!e.activa && <em>(inactiva) </em>}
            <button onClick={() => eliminar(e)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </>
  );
}
