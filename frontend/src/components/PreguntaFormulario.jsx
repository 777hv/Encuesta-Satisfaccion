import { useState } from "react";
import { useIdioma } from "../idioma.jsx";

const TIPOS = ["Escala1a5", "SiNo", "TextoLibre"];

// Sirve para editar una pregunta existente (con onEliminar) y para crear una nueva (sin onEliminar).
export default function PreguntaFormulario({ inicial, onGuardar, onEliminar, textoBoton }) {
  const { t } = useIdioma();
  const [texto, setTexto] = useState(inicial.texto);
  const [tipo, setTipo] = useState(inicial.tipo);
  const [orden, setOrden] = useState(inicial.orden);

  function guardar(e) {
    e.preventDefault();
    onGuardar({ texto, tipo, orden: Number(orden) });
  }

  return (
    <form onSubmit={guardar} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
      <input aria-label={t("pregunta.orden")} type="number" min="1" value={orden}
        onChange={(e) => setOrden(e.target.value)} style={{ width: "4.5rem" }} required />
      <input aria-label={t("pregunta.texto")} value={texto}
        onChange={(e) => setTexto(e.target.value)} style={{ flex: 1 }} required />
      <select aria-label={t("pregunta.tipo")} value={tipo} onChange={(e) => setTipo(e.target.value)}>
        {TIPOS.map((valor) => (
          <option key={valor} value={valor}>{t(`tipo.${valor}`)}</option>
        ))}
      </select>
      <button type="submit">{textoBoton}</button>
      {onEliminar && (
        <button type="button" className="peligro" onClick={onEliminar}>{t("editar.eliminarPregunta")}</button>
      )}
    </form>
  );
}
