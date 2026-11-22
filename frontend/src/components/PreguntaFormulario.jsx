import { useState } from "react";

export const TIPOS = {
  Escala1a5: "Escala 1 a 5",
  SiNo: "Sí / No",
  TextoLibre: "Texto libre",
};

// Sirve para editar una pregunta existente (con onEliminar) y para crear una nueva (sin onEliminar).
export default function PreguntaFormulario({
  inicial,
  onGuardar,
  onEliminar,
  textoBoton,
}) {
  const [texto, setTexto] = useState(inicial.texto);
  const [tipo, setTipo] = useState(inicial.tipo);
  const [orden, setOrden] = useState(inicial.orden);

  function guardar(e) {
    e.preventDefault();
    onGuardar({ texto, tipo, orden: Number(orden) });
  }

  return (
    <form
      onSubmit={guardar}
      style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
    >
      <input
        aria-label="Orden"
        type="number"
        min="1"
        value={orden}
        onChange={(e) => setOrden(e.target.value)}
        style={{ width: "4rem" }}
        required
      />
      <input
        aria-label="Texto de la pregunta"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        style={{ flex: 1 }}
        required
      />
      <select
        aria-label="Tipo"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      >
        {Object.entries(TIPOS).map(([valor, nombre]) => (
          <option key={valor} value={valor}>
            {nombre}
          </option>
        ))}
      </select>
      <button type="submit">{textoBoton}</button>
      {onEliminar && (
        <button type="button" onClick={onEliminar}>
          Eliminar
        </button>
      )}
    </form>
  );
}
