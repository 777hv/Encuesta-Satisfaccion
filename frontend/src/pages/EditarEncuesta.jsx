import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api.js";
import { useIdioma } from "../idioma.jsx";
import PreguntaFormulario from "../components/PreguntaFormulario.jsx";
import { ESTILOS, TEMATICAS } from "../catalogos.js";

export default function EditarEncuesta() {
  const { id } = useParams();
  const { t } = useIdioma();
  const [encuesta, setEncuesta] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function cargar() {
    try {
      setEncuesta(await api.obtenerEncuesta(id));
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    cargar();
  }, [id]);

  // Ejecuta una acción contra la API, muestra su error o un mensaje de éxito (clave de texto), y recarga la encuesta.
  async function ejecutar(accion, exito) {
    setError("");
    setMensaje("");
    try {
      await accion();
      setMensaje(exito);
      await cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  if (!encuesta)
    return error ? (
      <p role="alert">{t(error)}</p>
    ) : (
      <p className="texto-suave">{t("cargando")}</p>
    );

  function guardarEncuesta(e) {
    e.preventDefault();
    const datos = new FormData(e.target);
    ejecutar(
      () =>
        api.actualizarEncuesta(id, {
          titulo: datos.get("titulo"),
          descripcion: datos.get("descripcion"),
          activa: datos.get("activa") === "on",
          tematica: datos.get("tematica"),
          estilo: datos.get("estilo"),
        }),
      "editar.guardada",
    );
  }

  const preguntas = [...encuesta.preguntas].sort((a, b) => a.orden - b.orden);
  const enlacePublico = `${location.origin}/responder/${id}`;

  async function copiarEnlace() {
    await navigator.clipboard.writeText(enlacePublico);
    setError("");
    setMensaje("editar.copiado");
  }

  return (
    <>
      <div className="encabezado">
        <div>
          <h1>{encuesta.titulo}</h1>
          <p className="texto-suave">{t("editar.titulo")}</p>
        </div>
        <Link className="boton secundario" to={`/encuestas/${id}/resultados`}>
          {t("editar.verResultados")}
        </Link>
      </div>

      <div className="avisos" aria-live="polite">
        {error && <p role="alert">{t(error)}</p>}
        {mensaje && <p role="status">{t(mensaje)}</p>}
      </div>

      <section>
        <h2>{t("editar.datos")}</h2>
        <form onSubmit={guardarEncuesta}>
          <div className="campo">
            <label htmlFor="titulo">{t("editar.campoTitulo")}</label>
            <input
              id="titulo"
              name="titulo"
              defaultValue={encuesta.titulo}
              required
              maxLength={200}
            />
          </div>
          <div className="campo">
            <label htmlFor="descripcion">{t("editar.campoDescripcion")}</label>
            <textarea
              id="descripcion"
              name="descripcion"
              defaultValue={encuesta.descripcion ?? ""}
              rows={3}
              maxLength={1000}
            />
          </div>
          <div className="campo">
            <label htmlFor="tematica">{t("editar.tematica")}</label>
            <select
              id="tematica"
              name="tematica"
              defaultValue={encuesta.tematica}
            >
              {TEMATICAS.map((tematica) => (
                <option key={tematica} value={tematica}>
                  {t(`tematica.${tematica}`)}
                </option>
              ))}
            </select>
          </div>
          <fieldset className="estilos">
            <legend>{t("editar.estilo")}</legend>
            <div className="muestras">
              {ESTILOS.map((estilo) => (
                <label key={estilo} className="muestra" data-estilo={estilo}>
                  <input
                    type="radio"
                    name="estilo"
                    value={estilo}
                    defaultChecked={encuesta.estilo === estilo}
                  />
                  <span className="muestra-color" aria-hidden="true" />
                  {t(`estilo.${estilo}`)}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="casilla">
            <input
              type="checkbox"
              name="activa"
              defaultChecked={encuesta.activa}
            />{" "}
            {t("editar.activa")}
          </label>
          <button type="submit">{t("editar.guardar")}</button>
        </form>
      </section>

      <section className="seccion">
        <h2>{t("editar.enlace")}</h2>
        <div className="enlace-publico">
          <input
            readOnly
            value={enlacePublico}
            aria-label={t("editar.enlace")}
            onFocus={(e) => e.target.select()}
          />
          <button type="button" className="secundario" onClick={copiarEnlace}>
            {t("editar.copiar")}
          </button>
        </div>
      </section>

      <section className="seccion">
        <h2>{t("editar.preguntas")}</h2>
        {preguntas.length === 0 && (
          <p className="texto-suave">{t("editar.sinPreguntas")}</p>
        )}
        {preguntas.map((p) => (
          <PreguntaFormulario
            key={p.id}
            inicial={p}
            textoBoton={t("editar.guardarPregunta")}
            onGuardar={(datos) =>
              ejecutar(
                () => api.actualizarPregunta(id, p.id, datos),
                "editar.preguntaGuardada",
              )
            }
            onEliminar={() =>
              confirm(t("editar.confirmarEliminarPregunta")) &&
              ejecutar(
                () => api.eliminarPregunta(id, p.id),
                "editar.preguntaEliminada",
              )
            }
          />
        ))}

        <h3 className="nueva-pregunta">{t("editar.nuevaPregunta")}</h3>
        <PreguntaFormulario
          key={preguntas.length}
          inicial={{
            texto: "",
            tipo: "Escala1a5",
            orden: preguntas.length + 1,
          }}
          textoBoton={t("editar.agregar")}
          onGuardar={(datos) =>
            ejecutar(
              () => api.crearPregunta(id, datos),
              "editar.preguntaAgregada",
            )
          }
        />
      </section>
    </>
  );
}
