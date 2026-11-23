using Encuestas.Domain;

namespace Encuestas.Application;

public class TraduccionService(ITraductor traductor)
{
    // Cambia los textos solo en memoria; nunca se guardan traducidos en la base de datos.
    public async Task TraducirEncuestaAsync(Encuesta encuesta, string? idioma)
    {
        if (idioma is not ("es" or "en"))
            return;

        // Todo en una sola llamada: título, descripción y luego cada pregunta, en ese orden.
        var textos = new List<string> { encuesta.Titulo, encuesta.Descripcion ?? "" };
        textos.AddRange(encuesta.Preguntas.Select(p => p.Texto));

        var traducidos = await traductor.TraducirAsync(textos, idioma);

        encuesta.Titulo = traducidos[0];
        if (encuesta.Descripcion is not null)
            encuesta.Descripcion = traducidos[1];
        for (var i = 0; i < encuesta.Preguntas.Count; i++)
            encuesta.Preguntas[i].Texto = traducidos[i + 2];
    }

    // En resultados solo se traducen los comentarios: son lo único que escribió otra persona.
    public async Task TraducirComentariosAsync(ResultadoEncuesta resultado, string? idioma)
    {
        if (idioma is not ("es" or "en"))
            return;

        foreach (var texto in resultado.Preguntas.Select(p => p.Resultado).OfType<ResultadoTexto>())
        {
            var traducidos = await traductor.TraducirAsync(texto.Comentarios, idioma);
            for (var i = 0; i < traducidos.Count; i++)
                texto.Comentarios[i] = traducidos[i];
        }
    }
}
