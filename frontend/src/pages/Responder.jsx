import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api.js";
import { useIdioma } from "../idioma.jsx";

// Lee el borrador guardado; si no hay o está dañado, devuelve null en vez de romper la página.
function leerBorrador(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave));
  } catch {
    return null;
  }
}

export default function Responder() {
  const { id } = useParams();
  const { t, idioma } = useIdioma();
  const claveBorrador = `borrador-encuesta-${id}`;
  const [encuesta, setEncuesta] = useState(null);
  const [error, setError] = useState("");
  const [enviada, setEnviada] = useState(false);
  const [borrador, setBorrador] = useState(() => leerBorrador(claveBorrador));
  // Cambiar esta "versión" vuelve a montar el formulario vacío (al empezar de nuevo).
  const [version, setVersion] = useState(0);

  useEffect(() => {
    // Si el idioma cambia rápido dos veces, se ignora la respuesta vieja que llegue tarde.
    let vigente = true;
    api
      .encuestaPublica(id, idioma)
      .then((datos) => vigente && setEncuesta(datos))
      .catch(() => vigente && setError("responder.noDisponible"));
    return () => {
      vigente = false;
    };
  }, [id, idioma]);

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
  const hayBorrador =
    borrador && Object.values(borrador).some((valor) => valor !== "");

  // Se llama con cada cambio en cualquier campo del formulario (el evento "sube" desde el campo hasta el <form>).
  function guardarBorrador(e) {
    const datos = Object.fromEntries(new FormData(e.currentTarget));
    localStorage.setItem(claveBorrador, JSON.stringify(datos));
  }

  function empezarDeNuevo() {
    localStorage.removeItem(claveBorrador);
    setBorrador(null);
    setVersion((v) => v + 1);
  }

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
      localStorage.removeItem(claveBorrador);
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

      {hayBorrador && (
        <p role="status" className="aviso-borrador">
          {t("responder.recuperado")}
          <button type="button" className="secundario" onClick={empezarDeNuevo}>
            {t("responder.empezarDeNuevo")}
          </button>
        </p>
      )}

      <form key={version} onSubmit={enviar} onChange={guardarBorrador}>
        {preguntas.map((p) => (
          <fieldset key={p.id} className="pregunta-publica">
            <legend>
              {p.texto}
              {!p.obligatoria && (
                <span className="opcional">{t("responder.opcional")}</span>
              )}
            </legend>
            <Control pregunta={p} inicial={borrador?.[p.id]} />
          </fieldset>
        ))}

        {error && <p role="alert">{t(error)}</p>}
        <button type="submit">{t("responder.enviar")}</button>
        <p className="nota">{t("responder.autoguardado")}</p>
        <p className="nota">{t("traduccion.automatica")}</p>
      </form>
    </div>
  );
}

// Muestra el control adecuado según el tipo de pregunta. "inicial" es el valor recuperado del borrador.
function Control({ pregunta, inicial }) {
  const { t } = useIdioma();
  const nombre = String(pregunta.id);
  const requerida = pregunta.obligatoria;

  if (pregunta.tipo === "TextoLibre")
    return <textarea name={nombre} required={requerida} maxLength={2000} rows={4} defaultValue={inicial ?? ""} />;

  // El valor que se envía no cambia ("Si"/"No"); solo se traduce lo que se muestra.
  if (pregunta.tipo === "SiNo")
    return (
      <Opciones nombre={nombre} requerida={requerida} inicial={inicial}
        opciones={[["Si", t("si")], ["No", t("no")]]} />
    );

  return (
    <>
      <Opciones nombre={nombre} requerida={requerida} inicial={inicial} escala
        opciones={["1", "2", "3", "4", "5"].map((n) => [n, n])} />
      <div className="escala-extremos">
        <span>{t("responder.escalaMin")}</span>
        <span>{t("responder.escalaMax")}</span>
      </div>
    </>
  );
}

// Radios nativos (accesibles y con "required") mostrados como botones grandes.
function Opciones({ nombre, opciones, escala, requerida, inicial }) {
  return (
    <div className={escala ? "opciones escala" : "opciones"}>
      {opciones.map(([valor, texto]) => (
        <label key={valor} className="opcion">
          <input type="radio" name={nombre} value={valor} required={requerida} defaultChecked={inicial === valor} />
          <span>{texto}</span>
        </label>
      ))}
    </div>
  );
}
