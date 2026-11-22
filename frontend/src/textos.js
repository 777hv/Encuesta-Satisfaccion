// Todos los textos de la app. Cada clave debe existir en los dos idiomas.
export const textos = {
  es: {
    marca: "Encuestas",
    "tema.claro": "Cambiar a modo claro",
    "tema.oscuro": "Cambiar a modo oscuro",
    "idioma.cambiar": "Cambiar a inglés",
    noEncontrada: "Esta página no existe. Vuelve a la lista de encuestas.",
    cargando: "Cargando…",
    si: "Sí",
    no: "No",
    "error.conexion": "No se pudo conectar con la API. ¿Está corriendo?",
    "error.noEncontrado": "No se encontró lo que buscas.",
    "error.servidor": "Algo falló en el servidor. Intenta de nuevo.",
    "tipo.Escala1a5": "Escala 1 a 5",
    "tipo.SiNo": "Sí / No",
    "tipo.TextoLibre": "Texto libre",

    "lista.titulo": "Tus encuestas",
    "lista.nuevoTitulo": "Título de la nueva encuesta",
    "lista.crear": "Crear encuesta",
    "lista.vacia": "Todavía no tienes encuestas. Crea la primera arriba.",
    "lista.inactiva": "inactiva",
    "lista.eliminar": "Eliminar",
    "lista.confirmarEliminar":
      '¿Eliminar "{titulo}" con todas sus preguntas y respuestas?',

    "editar.titulo": "Editar encuesta",
    "editar.campoTitulo": "Título",
    "editar.campoDescripcion": "Descripción",
    "editar.activa": "Activa (acepta respuestas)",
    "editar.guardar": "Guardar encuesta",
    "editar.guardada": "Encuesta guardada.",
    "editar.enlace": "Enlace para responder:",
    "editar.verResultados": "Ver resultados",
    "editar.preguntas": "Preguntas",
    "editar.sinPreguntas": "Todavía no hay preguntas.",
    "editar.nuevaPregunta": "Nueva pregunta",
    "editar.agregar": "Agregar",
    "editar.guardarPregunta": "Guardar",
    "editar.eliminarPregunta": "Eliminar",
    "editar.confirmarEliminarPregunta": "¿Eliminar esta pregunta?",
    "editar.preguntaGuardada": "Pregunta guardada.",
    "editar.preguntaEliminada": "Pregunta eliminada.",
    "editar.preguntaAgregada": "Pregunta agregada.",

    "pregunta.orden": "Orden",
    "pregunta.texto": "Texto de la pregunta",
    "pregunta.tipo": "Tipo",

    "responder.noDisponible":
      "Esta encuesta no existe o ya no acepta respuestas.",
    "responder.enviar": "Enviar respuestas",
    "responder.gracias": "¡Gracias por responder!",

    "resultados.titulo": "Resultados: {titulo}",
    "resultados.total": "{n} respuestas",
    "resultados.editar": "Editar encuesta",
    "resultados.sinRespuestas":
      "Todavía no hay respuestas. Comparte el enlace público para empezar a recibirlas.",
    "resultados.promedio": "Promedio",
    "resultados.sinComentarios": "Sin comentarios.",
    "resultados.respuestas": "Respuestas",
  },
  en: {
    marca: "Surveys",
    "tema.claro": "Switch to light mode",
    "tema.oscuro": "Switch to dark mode",
    "idioma.cambiar": "Switch to Spanish",
    noEncontrada: "This page doesn't exist. Go back to the survey list.",
    cargando: "Loading…",
    si: "Yes",
    no: "No",
    "error.conexion": "Couldn't connect to the API. Is it running?",
    "error.noEncontrado": "We couldn't find what you're looking for.",
    "error.servidor": "Something went wrong on the server. Try again.",
    "tipo.Escala1a5": "Scale 1 to 5",
    "tipo.SiNo": "Yes / No",
    "tipo.TextoLibre": "Free text",

    "lista.titulo": "Your surveys",
    "lista.nuevoTitulo": "New survey title",
    "lista.crear": "Create survey",
    "lista.vacia":
      "You don't have any surveys yet. Create the first one above.",
    "lista.inactiva": "inactive",
    "lista.eliminar": "Delete",
    "lista.confirmarEliminar":
      'Delete "{titulo}" with all its questions and answers?',

    "editar.titulo": "Edit survey",
    "editar.campoTitulo": "Title",
    "editar.campoDescripcion": "Description",
    "editar.activa": "Active (accepting responses)",
    "editar.guardar": "Save survey",
    "editar.guardada": "Survey saved.",
    "editar.enlace": "Link to respond:",
    "editar.verResultados": "View results",
    "editar.preguntas": "Questions",
    "editar.sinPreguntas": "No questions yet.",
    "editar.nuevaPregunta": "New question",
    "editar.agregar": "Add",
    "editar.guardarPregunta": "Save",
    "editar.eliminarPregunta": "Delete",
    "editar.confirmarEliminarPregunta": "Delete this question?",
    "editar.preguntaGuardada": "Question saved.",
    "editar.preguntaEliminada": "Question deleted.",
    "editar.preguntaAgregada": "Question added.",

    "pregunta.orden": "Order",
    "pregunta.texto": "Question text",
    "pregunta.tipo": "Type",

    "responder.noDisponible":
      "This survey doesn't exist or is no longer accepting responses.",
    "responder.enviar": "Submit answers",
    "responder.gracias": "Thanks for your answers!",

    "resultados.titulo": "Results: {titulo}",
    "resultados.total": "{n} responses",
    "resultados.editar": "Edit survey",
    "resultados.sinRespuestas":
      "No responses yet. Share the public link to start collecting them.",
    "resultados.promedio": "Average",
    "resultados.sinComentarios": "No comments.",
    "resultados.respuestas": "Responses",
  },
};

// En desarrollo avisa en la consola (F12) si a inglés le falta alguna clave de español.
if (import.meta.env.DEV)
  for (const clave of Object.keys(textos.es))
    console.assert(clave in textos.en, `Falta la clave "${clave}" en inglés`);
