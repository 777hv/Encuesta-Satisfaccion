using Encuestas.Domain;

namespace Encuestas.Application;

public record RespuestaPreguntaDto(int PreguntaId, string Valor);
public record ResponderEncuestaDto(List<RespuestaPreguntaDto> Respuestas);

public class RespuestaService(IEncuestaRepository encuestas, IRespuestaRepository respuestas)
{
    public async Task<Respuesta?> ResponderAsync(int encuestaId, ResponderEncuestaDto dto)
    {
        var encuesta = await encuestas.ObtenerAsync(encuestaId);
        if (encuesta is null)
            return null;

        if (!encuesta.Activa)
            throw new ArgumentException("La encuesta no está activa.");

        if (encuesta.Preguntas.Count == 0)
            throw new ArgumentException("La encuesta no tiene preguntas.");

        var preguntas = encuesta.Preguntas.ToDictionary(p => p.Id);

        var idsRespondidos = dto.Respuestas.Select(r => r.PreguntaId).Distinct().Count();
        if (dto.Respuestas.Count != preguntas.Count || idsRespondidos != preguntas.Count)
            throw new ArgumentException("Debe responder cada pregunta una sola vez.");

        foreach (var r in dto.Respuestas)
        {
            if (!preguntas.TryGetValue(r.PreguntaId, out var pregunta))
                throw new ArgumentException($"La pregunta {r.PreguntaId} no pertenece a esta encuesta.");

            if (!EsValorValido(pregunta.Tipo, r.Valor))
                throw new ArgumentException($"El valor de la pregunta {r.PreguntaId} no es válido.");
        }

        return await respuestas.CrearAsync(new Respuesta
        {
            EncuestaId = encuestaId,
            Detalles = dto.Respuestas
                .Select(r => new RespuestaPregunta { PreguntaId = r.PreguntaId, Valor = r.Valor.Trim() })
                .ToList()
        });
    }

    private static bool EsValorValido(TipoPregunta tipo, string valor) => tipo switch
    {
        TipoPregunta.Escala1a5 => int.TryParse(valor, out var n) && n is >= 1 and <= 5,
        TipoPregunta.SiNo => valor is "Si" or "No",
        TipoPregunta.TextoLibre => !string.IsNullOrWhiteSpace(valor) && valor.Length <= 2000,
        _ => false
    };
}
