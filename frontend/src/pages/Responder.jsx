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
    api
      .encuestaPublica(id)
      .then(setEncuesta)
      .catch(() => setError("responder.noDisponible"));
  }, [id]);

  if (enviada)
    return (
      <div className="angosto gracias">
        <h1>{t("responder.gracias")}</h1>
        <p className="texto-suave">{t("responder.graciasDetalle")}</p>
      </div>
    );

  if (!encuesta)
    return (
      <div className="angosto">
        {error ? (
          <p role="alert">{t(error)}</p>
        ) : (
          <p className="texto-suave">{t("cargando")}</p>
        )}
      </div>
    );

  const preguntas = [...encuesta.preguntas].sort((a, b) => a.orden - b.orden);

  async function enviar(e) {
    e.preventDefault();
    const datos = new FormData(e.target);
    setError("");
    try {
      // Cada control se llama como el id de su pregunta, así armamos lo que espera la API.
      await api.responder(
        id,
        preguntas.map((p) => ({
          preguntaId: p.id,
          valor: datos.get(String(p.id)) ?? "",
        })),
      );
      setEnviada(true);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="angosto" data-estilo={encuesta.estilo}>
      <div className="encabezado">
        <div>
          <h1>{encuesta.titulo}</h1>
          {encuesta.descripcion && (
            <p className="texto-suave">{encuesta.descripcion}</p>
          )}
        </div>
      </div>

      <form onSubmit={enviar}>
        {preguntas.map((p) => (
          <fieldset key={p.id} className="pregunta-publica">
            <legend>
              {p.texto}
              {!p.obligatoria && (
                <span className="opcional">{t("responder.opcional")}</span>
              )}
            </legend>
            <Control pregunta={p} />
          </fieldset>
        ))}

        {error && <p role="alert">{t(error)}</p>}
        <button type="submit">{t("responder.enviar")}</button>
      </form>
    </div>
  );
}

// Muestra el control adecuado según el tipo de pregunta.
function Control({ pregunta }) {
  const { t } = useIdioma();
  const nombre = String(pregunta.id);
  const requerida = pregunta.obligatoria;

  if (pregunta.tipo === "TextoLibre")
    return (
      <textarea name={nombre} required={requerida} maxLength={2000} rows={4} />
    );

  // El valor que se envía no cambia ("Si"/"No"); solo se traduce lo que se muestra.
  if (pregunta.tipo === "SiNo")
    return (
      <Opciones
        nombre={nombre}
        requerida={requerida}
        opciones={[
          ["Si", t("si")],
          ["No", t("no")],
        ]}
      />
    );

  return (
    <>
      <Opciones
        nombre={nombre}
        requerida={requerida}
        escala
        opciones={["1", "2", "3", "4", "5"].map((n) => [n, n])}
      />
      <div className="escala-extremos">
        <span>{t("responder.escalaMin")}</span>
        <span>{t("responder.escalaMax")}</span>
      </div>
    </>
  );
}

// Radios nativos (accesibles y con "required") mostrados como botones grandes.
function Opciones({ nombre, opciones, escala, requerida }) {
  return (
    <div className={escala ? "opciones escala" : "opciones"}>
      {opciones.map(([valor, texto]) => (
        <label key={valor} className="opcion">
          <input
            type="radio"
            name={nombre}
            value={valor}
            required={requerida}
          />
          <span>{texto}</span>
        </label>
      ))}
    </div>
  );
}
