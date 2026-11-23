import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useIdioma } from "../idioma.jsx";
import { TEMATICAS } from "../catalogos.js";

export default function ListaEncuestas() {
  const { idioma, t } = useIdioma();
  const [encuestas, setEncuestas] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [filtro, setFiltro] = useState("");
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
    if (!confirm(t("lista.confirmarEliminar", { titulo: encuesta.titulo })))
      return;
    try {
      await api.eliminarEncuesta(encuesta.id);
      cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  const fecha = (texto) =>
    new Date(texto).toLocaleDateString(idioma, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // shortcut: filtra en el navegador la lista ya cargada; si llegan a ser cientos de encuestas, filtrar en la API con ?tematica=.
  const visibles = encuestas?.filter((e) => !filtro || e.tematica === filtro);

  return (
    <>
      <div className="encabezado">
        <div>
          <h1>{t("lista.titulo")}</h1>
          <p className="texto-suave">{t("lista.subtitulo")}</p>
        </div>
      </div>

      <form className="crear" onSubmit={crear}>
        <label htmlFor="titulo" className="oculto">
          {t("lista.nuevoTitulo")}
        </label>
        <input
          id="titulo"
          placeholder={t("lista.nuevoTitulo")}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          maxLength={200}
        />
        <button type="submit">{t("lista.crear")}</button>
      </form>

      {error && <p role="alert">{t(error)}</p>}

      {!encuestas ? (
        !error && <p className="texto-suave">{t("cargando")}</p>
      ) : encuestas.length === 0 ? (
        <p className="texto-suave">{t("lista.vacia")}</p>
      ) : (
        <>
          <div className="herramientas">
            <label htmlFor="filtro">{t("lista.filtrar")}</label>
            <select
              id="filtro"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="">{t("lista.todas")}</option>
              {TEMATICAS.map((tematica) => (
                <option key={tematica} value={tematica}>
                  {t(`tematica.${tematica}`)}
                </option>
              ))}
            </select>
          </div>

          {visibles.length === 0 ? (
            <p className="texto-suave">{t("lista.sinCoincidencias")}</p>
          ) : (
            <div className="tabla-contenedor">
              <table className="tabla">
                <thead>
                  <tr>
                    <th>{t("lista.colTitulo")}</th>
                    <th className="ocultar-movil">{t("lista.colTematica")}</th>
                    <th>{t("lista.colEstado")}</th>
                    <th className="ocultar-movil">{t("lista.colPreguntas")}</th>
                    <th className="ocultar-movil">{t("lista.colCreada")}</th>
                    <th className="acciones">
                      <span className="oculto">{t("lista.colAcciones")}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibles.map((encuesta) => (
                    <tr key={encuesta.id}>
                      <td className="titulo-encuesta">
                        <span
                          className="muestra-color"
                          data-estilo={encuesta.estilo}
                          aria-hidden="true"
                        />
                        <Link to={`/encuestas/${encuesta.id}`}>
                          {encuesta.titulo}
                        </Link>
                      </td>
                      <td className="ocultar-movil texto-suave">
                        {t(`tematica.${encuesta.tematica}`)}
                      </td>
                      <td>
                        <span
                          className={
                            encuesta.activa ? "estado activa" : "estado"
                          }
                        >
                          {t(
                            encuesta.activa ? "lista.activa" : "lista.inactiva",
                          )}
                        </span>
                      </td>
                      <td className="ocultar-movil">
                        {encuesta.preguntas.length}
                      </td>
                      <td className="ocultar-movil texto-suave">
                        {fecha(encuesta.fechaCreacion)}
                      </td>
                      <td className="acciones">
                        <Link to={`/encuestas/${encuesta.id}/resultados`}>
                          {t("lista.resultados")}
                        </Link>
                        <button
                          type="button"
                          className="peligro"
                          onClick={() => eliminar(encuesta)}
                        >
                          {t("lista.eliminar")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );
}
