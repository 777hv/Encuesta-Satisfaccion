import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api.js";
import PreguntaFormulario from "../components/PreguntaFormulario.jsx";

export default function EditarEncuesta() {
  const { id } = useParams();
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

  // Ejecuta una acción contra la API, muestra su error o un mensaje de éxito, y recarga la encuesta.
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

  if (!encuesta) return error ? <p role="alert">{error}</p> : <p>Cargando…</p>;

  function guardarEncuesta(e) {
    e.preventDefault();
    const datos = new FormData(e.target);
    ejecutar(
      () =>
        api.actualizarEncuesta(id, {
          titulo: datos.get("titulo"),
          descripcion: datos.get("descripcion"),
          activa: datos.get("activa") === "on",
        }),
      "Encuesta guardada.",
    );
  }

  const preguntas = [...encuesta.preguntas].sort((a, b) => a.orden - b.orden);
  const enlacePublico = `${location.origin}/responder/${id}`;

  return (
    <>
      <h1>Editar encuesta</h1>

      <form onSubmit={guardarEncuesta}>
        <p>
          <label>
            Título
            <br />
            <input
              name="titulo"
              defaultValue={encuesta.titulo}
              required
              style={{ width: "100%" }}
            />
          </label>
        </p>
        <p>
          <label>
            Descripción
            <br />
            <textarea
              name="descripcion"
              defaultValue={encuesta.descripcion ?? ""}
              rows={3}
              style={{ width: "100%" }}
            />
          </label>
        </p>
        <p>
          <label>
            <input
              type="checkbox"
              name="activa"
              defaultChecked={encuesta.activa}
            />{" "}
            Activa (acepta respuestas)
          </label>
        </p>
        <button type="submit">Guardar encuesta</button>
      </form>

      {error && <p role="alert">{error}</p>}
      {mensaje && <p role="status">{mensaje}</p>}

      <p>
        Enlace para responder: <a href={enlacePublico}>{enlacePublico}</a>
        <br />
        <Link to={`/encuestas/${id}/resultados`}>Ver resultados</Link>
      </p>

      <h2>Preguntas</h2>
      {preguntas.length === 0 && <p>Todavía no hay preguntas.</p>}
      {preguntas.map((p) => (
        <PreguntaFormulario
          key={p.id}
          inicial={p}
          textoBoton="Guardar"
          onGuardar={(datos) =>
            ejecutar(
              () => api.actualizarPregunta(id, p.id, datos),
              "Pregunta guardada.",
            )
          }
          onEliminar={() =>
            confirm("¿Eliminar esta pregunta?") &&
            ejecutar(
              () => api.eliminarPregunta(id, p.id),
              "Pregunta eliminada.",
            )
          }
        />
      ))}

      <h3>Nueva pregunta</h3>
      <PreguntaFormulario
        key={preguntas.length}
        inicial={{ texto: "", tipo: "Escala1a5", orden: preguntas.length + 1 }}
        textoBoton="Agregar"
        onGuardar={(datos) =>
          ejecutar(() => api.crearPregunta(id, datos), "Pregunta agregada.")
        }
      />
    </>
  );
}
