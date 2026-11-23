import { useState } from "react";
import { useIdioma } from "../idioma.jsx";

const TIPOS = ["Escala1a5", "SiNo", "TextoLibre"];

// Sirve para editar una pregunta existente (con onEliminar) y para crear una nueva (sin onEliminar).
export default function PreguntaFormulario({ inicial, onGuardar, onEliminar, textoBoton }) {
  const { t } = useIdioma();
  const [texto, setTexto] = useState(inicial.texto);
  const [tipo, setTipo] = useState(inicial.tipo);
  const [orden, setOrden] = useState(inicial.orden);
  const [obligatoria, setObligatoria] = useState(inicial.obligatoria);

  function guardar(e) {
    e.preventDefault();
    onGuardar({ texto, tipo, orden: Number(orden), obligatoria });
  }

  return (
    <form onSubmit={guardar} className="pregunta-fila">
      <input
        aria-label={t("pregunta.orden")}
        type="number"
        min="1"
        value={orden}
        onChange={(e) => setOrden(e.target.value)}
        required
      />
      <input
        aria-label={t("pregunta.texto")}
        placeholder={t("pregunta.texto")}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        required
        maxLength={500}
      />
      <select
        aria-label={t("pregunta.tipo")}
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      >
        {TIPOS.map((valor) => (
          <option key={valor} value={valor}>
            {t(`tipo.${valor}`)}
          </option>
        ))}
      </select>
      <label className="casilla-pregunta">
        <input
          type="checkbox"
          checked={obligatoria}
          onChange={(e) => setObligatoria(e.target.checked)}
        />
        {t("pregunta.obligatoria")}
      </label>
      <div className="acciones">
        {/* En preguntas existentes "Guardar" es secundario; "Agregar pregunta" es la acción principal. */}
        <button type="submit" className={onEliminar ? "secundario" : undefined}>
          {textoBoton}
        </button>
        {onEliminar && (
          <button type="button" className="peligro" onClick={onEliminar}>
            {t("editar.eliminarPregunta")}
          </button>
        )}
      </div>
    </form>
  );
}
