import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api.js";
import { useIdioma } from "../idioma.jsx";

export default function Responder() {
  const { id } = useParams();
  const { t } = useIdioma();
  const [encuesta, setEncuesta] = useState(null);
  const [error, setError] = useState("");
  const [enviada, setEnviada] = useState(false);

  useEffect(() => {
    api.encuestaPublica(id)
      .then(setEncuesta)
      .catch(() => setError("responder.noDisponible"));
  }, [id]);

  if (enviada) return <h1>{t("responder.gracias")}</h1>;
  if (!encuesta) return error ? <p role="alert">{t(error)}</p> : <p>{t("cargando")}</p>;

  const preguntas = [...encuesta.preguntas].sort((a, b) => a.orden - b.orden);

  async function enviar(e) {
    e.preventDefault();
    const datos = new FormData(e.target);
    setError("");
    try {
      // Cada control se llama como el id de su pregunta, así armamos lo que espera la API.
      await api.responder(id, preguntas.map((p) => ({ preguntaId: p.id, valor: datos.get(String(p.id)) ?? "" })));
      setEnviada(true);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <h1>{encuesta.titulo}</h1>
      {encuesta.descripcion && <p>{encuesta.descripcion}</p>}

      <form onSubmit={enviar}>
        {preguntas.map((p) => (
          <fieldset key={p.id} style={{ marginBottom: "1rem" }}>
            <legend>{p.texto}</legend>
            <Control pregunta={p} />
          </fieldset>
        ))}

        {error && <p role="alert">{t(error)}</p>}
        <button type="submit">{t("responder.enviar")}</button>
      </form>
    </>
  );
}

// Muestra el control adecuado según el tipo de pregunta.
function Control({ pregunta }) {
  const { t } = useIdioma();
  const nombre = String(pregunta.id);

  if (pregunta.tipo === "TextoLibre")
    return <textarea name={nombre} required maxLength={2000} rows={3} style={{ width: "100%" }} />;

  // El valor que se envía no cambia ("Si"/"No"); solo se traduce lo que se muestra.
  const opciones = pregunta.tipo === "SiNo"
    ? [["Si", t("si")], ["No", t("no")]]
    : ["1", "2", "3", "4", "5"].map((n) => [n, n]);

  return opciones.map(([valor, texto]) => (
    <label key={valor} style={{ marginRight: "1rem" }}>
      <input type="radio" name={nombre} value={valor} required /> {texto}
    </label>
  ));
}