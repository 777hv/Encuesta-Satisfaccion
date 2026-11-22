const API = import.meta.env.VITE_API_URL ?? "http://localhost:5080";

// Hace la petición y convierte los errores de la API (ProblemDetails) en un Error con mensaje legible.
async function pedir(ruta, opciones = {}) {
  let r;
  try {
    r = await fetch(`${API}/api${ruta}`, {
      ...opciones,
      headers: { "Content-Type": "application/json" },
    });
    } catch {
    throw new Error("error.conexion");
  }

  if (!r.ok) {
    const problema = await r.json().catch(() => null);
    throw new Error(problema?.detail ?? (r.status === 404 ? "error.noEncontrado" : problema?.title ?? "error.servidor"));
  }

  return r.status === 204 ? null : r.json();
}

const json = (datos) => JSON.stringify(datos);

export const api = {
  listarEncuestas: () => pedir("/encuestas"),
  obtenerEncuesta: (id) => pedir(`/encuestas/${id}`),
  crearEncuesta: (datos) =>
    pedir("/encuestas", { method: "POST", body: json(datos) }),
  actualizarEncuesta: (id, datos) =>
    pedir(`/encuestas/${id}`, { method: "PUT", body: json(datos) }),
  eliminarEncuesta: (id) => pedir(`/encuestas/${id}`, { method: "DELETE" }),

  crearPregunta: (encuestaId, datos) =>
    pedir(`/encuestas/${encuestaId}/preguntas`, {
      method: "POST",
      body: json(datos),
    }),
  actualizarPregunta: (encuestaId, preguntaId, datos) =>
    pedir(`/encuestas/${encuestaId}/preguntas/${preguntaId}`, {
      method: "PUT",
      body: json(datos),
    }),
  eliminarPregunta: (encuestaId, preguntaId) =>
    pedir(`/encuestas/${encuestaId}/preguntas/${preguntaId}`, {
      method: "DELETE",
    }),

  encuestaPublica: (id) => pedir(`/publico/encuestas/${id}`),
  responder: (encuestaId, respuestas) =>
    pedir(`/publico/encuestas/${encuestaId}/respuestas`, {
      method: "POST",
      body: json({ respuestas }),
    }),
  resultados: (encuestaId) => pedir(`/encuestas/${encuestaId}/resultados`),
};
