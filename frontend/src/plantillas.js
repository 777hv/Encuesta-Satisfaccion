import { ESTILOS, TEMATICAS } from "./catalogos.js";

// Plantillas de referencia. No están en la base de datos: al usarlas se crea una copia editable.
export const PLANTILLAS = [
  {
    id: "atencion",
    tematica: "AtencionCliente",
    estilo: "Petroleo",
    titulo: { es: "Satisfacción con la atención", en: "Customer service satisfaction" },
    descripcion: {
      es: "Cuéntenos cómo fue su experiencia con nuestro equipo.",
      en: "Tell us how your experience with our team went.",
    },
    preguntas: [
      { tipo: "Escala1a5", obligatoria: true, es: "¿Qué tan satisfecho está con la atención recibida?", en: "How satisfied are you with the service you received?" },
      { tipo: "Escala1a5", obligatoria: true, es: "¿Qué tan rápido se resolvió su consulta?", en: "How quickly was your request resolved?" },
      { tipo: "SiNo", obligatoria: true, es: "¿Recomendaría nuestro servicio a otra persona?", en: "Would you recommend our service to someone else?" },
      { tipo: "TextoLibre", obligatoria: false, es: "¿Qué podríamos mejorar?", en: "What could we improve?" },
    ],
  },
  {
    id: "evento",
    tematica: "Evento",
    estilo: "Coral",
    titulo: { es: "Evaluación del evento", en: "Event feedback" },
    descripcion: {
      es: "Su opinión nos ayuda a preparar el próximo.",
      en: "Your feedback helps us plan the next one.",
    },
    preguntas: [
      { tipo: "Escala1a5", obligatoria: true, es: "¿Cómo calificaría el evento en general?", en: "How would you rate the event overall?" },
      { tipo: "Escala1a5", obligatoria: true, es: "¿Qué tan útil fue el contenido presentado?", en: "How useful was the content presented?" },
      { tipo: "SiNo", obligatoria: true, es: "¿Asistiría a una próxima edición?", en: "Would you attend a future edition?" },
      { tipo: "TextoLibre", obligatoria: false, es: "¿Qué tema le gustaría ver la próxima vez?", en: "What topic would you like to see next time?" },
    ],
  },
  {
    id: "clima",
    tematica: "Empleados",
    estilo: "Bosque",
    titulo: { es: "Clima laboral", en: "Workplace climate" },
    descripcion: {
      es: "Encuesta anónima sobre su experiencia en el equipo.",
      en: "Anonymous survey about your experience on the team.",
    },
    preguntas: [
      { tipo: "Escala1a5", obligatoria: true, es: "¿Qué tan satisfecho está con su trabajo actual?", en: "How satisfied are you with your current job?" },
      { tipo: "Escala1a5", obligatoria: true, es: "¿Cómo calificaría la comunicación en su equipo?", en: "How would you rate communication within your team?" },
      { tipo: "SiNo", obligatoria: true, es: "¿Cuenta con las herramientas necesarias para su trabajo?", en: "Do you have the tools you need to do your job?" },
      { tipo: "TextoLibre", obligatoria: false, es: "¿Qué cambiaría para trabajar mejor?", en: "What would you change to work better?" },
    ],
  },
];

// Aviso en desarrollo si una plantilla usa un valor que el backend rechazaría.
if (import.meta.env.DEV)
  for (const p of PLANTILLAS) {
    console.assert(TEMATICAS.includes(p.tematica), `Temática inválida en "${p.id}"`);
    console.assert(ESTILOS.includes(p.estilo), `Estilo inválido en "${p.id}"`);
    for (const q of p.preguntas)
      console.assert(["Escala1a5", "SiNo", "TextoLibre"].includes(q.tipo), `Tipo inválido en "${p.id}"`);
  }
