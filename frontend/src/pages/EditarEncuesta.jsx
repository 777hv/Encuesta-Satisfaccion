import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api.js";
import { useIdioma } from "../idioma.jsx";
import PreguntaFormulario from "../components/PreguntaFormulario.jsx";

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

  if (!encuesta) return error ? <p role="alert">{t(error)}</p> : <p>{t("cargando")}</p>;

  function guardarEncuesta(e) {
    e.preventDefault();
    const datos = new FormData(e.target);
    ejecutar(
      () => api.actualizarEncuesta(id, {
        titulo: datos.get("titulo"),
        descripcion: datos.get("descripcion"),
        activa: datos.get("activa") === "on",
      }),
      "editar.guardada"
    );
  }

  const preguntas = [...encuesta.preguntas].sort((a, b) => a.orden - b.orden);
  const enlacePublico = `${location.origin}/responder/${id}`;

  return (
    <>
      <h1>{t("editar.titulo")}</h1>

      <form onSubmit={guardarEncuesta}>
        <p>
          <label>{t("editar.campoTitulo")}<br />
            <input name="titulo" defaultValue={encuesta.titulo} required style={{ width: "100%" }} />
          </label>
        </p>
        <p>
          <label>{t("editar.campoDescripcion")}<br />
            <textarea name="descripcion" defaultValue={encuesta.descripcion ?? ""} rows={3} style={{ width: "100%" }} />
          </label>
        </p>
        <p>
          <label>
            <input type="checkbox" name="activa" defaultChecked={encuesta.activa} /> {t("editar.activa")}
          </label>
        </p>
        <button type="submit">{t("editar.guardar")}</button>
      </form>

      {error && <p role="alert">{t(error)}</p>}
      {mensaje && <p role="status">{t(mensaje)}</p>}

      <p>
        {t("editar.enlace")} <a href={enlacePublico}>{enlacePublico}</a>
        <br />
        <Link to={`/encuestas/${id}/resultados`}>{t("editar.verResultados")}</Link>
      </p>

      <h2>{t("editar.preguntas")}</h2>
      {preguntas.length === 0 && <p>{t("editar.sinPreguntas")}</p>}
      {preguntas.map((p) => (
        <PreguntaFormulario
          key={p.id}
          inicial={p}
          textoBoton={t("editar.guardarPregunta")}
          onGuardar={(datos) => ejecutar(() => api.actualizarPregunta(id, p.id, datos), "editar.preguntaGuardada")}
          onEliminar={() =>
            confirm(t("editar.confirmarEliminarPregunta")) &&
            ejecutar(() => api.eliminarPregunta(id, p.id), "editar.preguntaEliminada")
          }
        />
      ))}

      <h3>{t("editar.nuevaPregunta")}</h3>
      <PreguntaFormulario
        key={preguntas.length}
        inicial={{ texto: "", tipo: "Escala1a5", orden: preguntas.length + 1 }}
        textoBoton={t("editar.agregar")}
        onGuardar={(datos) => ejecutar(() => api.crearPregunta(id, datos), "editar.preguntaAgregada")}
      />
    </>
  );
}