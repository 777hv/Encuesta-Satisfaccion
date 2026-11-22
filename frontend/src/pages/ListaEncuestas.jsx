import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useIdioma } from "../idioma.jsx";

export default function ListaEncuestas() {
  const { t } = useIdioma();
  const [encuestas, setEncuestas] = useState(null);
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
    if (!confirm(t("lista.confirmarEliminar", { titulo: encuesta.titulo }))) return;
    try {
      await api.eliminarEncuesta(encuesta.id);
      cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <h1>{t("lista.titulo")}</h1>

      <form onSubmit={crear}>
        <label htmlFor="titulo">{t("lista.nuevoTitulo")}</label>{" "}
        <input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />{" "}
        <button type="submit">{t("lista.crear")}</button>
      </form>

      {error && <p role="alert">{t(error)}</p>}

      {!encuestas ? (
        !error && <p>{t("cargando")}</p>
      ) : encuestas.length === 0 ? (
        <p>{t("lista.vacia")}</p>
      ) : (
        <ul>
          {encuestas.map((encuesta) => (
            <li key={encuesta.id}>
              <Link to={`/encuestas/${encuesta.id}`}>{encuesta.titulo}</Link>{" "}
              {!encuesta.activa && <em>({t("lista.inactiva")}) </em>}
              <button type="button" className="peligro" onClick={() => eliminar(encuesta)}>
                {t("lista.eliminar")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}