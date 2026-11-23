using Encuestas.Domain;

namespace Encuestas.Application;

public record RespuestaPreguntaDto(int PreguntaId, string Valor);
public record ResponderEncuestaDto(List<RespuestaPreguntaDto> Respuestas);

public class RespuestaService(IEncuestaRepository encuestas, IRespuestaRepository respuestas)
{

    // Lo que ve quien responde: solo encuestas que existen y están activas.
    public async Task<Encuesta?> ObtenerParaResponderAsync(int encuestaId)
    {
        var encuesta = await encuestas.ObtenerAsync(encuestaId);
        return encuesta is { Activa: true } ? encuesta : null;
    }
    public async Task<Respuesta?> ResponderAsync(int encuestaId, ResponderEncuestaDto dto)
    {
        var encuesta = await encuestas.ObtenerAsync(encuestaId);
        if (encuesta is null)
            return null;

        if (!encuesta.Activa)
            throw new ValidacionException("La encuesta no está activa.");

        if (encuesta.Preguntas.Count == 0)
            throw new ValidacionException("La encuesta no tiene preguntas.");

        var preguntas = encuesta.Preguntas.ToDictionary(p => p.Id);

        // Una respuesta vacía cuenta como "no respondida": se permite solo en preguntas opcionales.
        var respondidas = dto.Respuestas.Where(r => !string.IsNullOrWhiteSpace(r.Valor)).ToList();

        if (respondidas.Select(r => r.PreguntaId).Distinct().Count() != respondidas.Count)
            throw new ValidacionException("Cada pregunta se responde una sola vez.");

        foreach (var r in respondidas)
        {
            if (!preguntas.TryGetValue(r.PreguntaId, out var pregunta))
                throw new ValidacionException($"La pregunta {r.PreguntaId} no pertenece a esta encuesta.");

            if (!EsValorValido(pregunta.Tipo, r.Valor))
                throw new ValidacionException($"El valor de la pregunta {r.PreguntaId} no es válido.");
        }

        var faltante = encuesta.Preguntas
            .OrderBy(p => p.Orden)
            .FirstOrDefault(p => p.Obligatoria && respondidas.All(r => r.PreguntaId != p.Id));
        if (faltante is not null)
            throw new ValidacionException($"La pregunta \"{faltante.Texto}\" es obligatoria.");

        if (respondidas.Count == 0)
            throw new ValidacionException("Responde al menos una pregunta.");

        return await respuestas.CrearAsync(new Respuesta
        {
            EncuestaId = encuestaId,
            Detalles = respondidas
                .Select(r => new RespuestaPregunta { PreguntaId = r.PreguntaId, Valor = r.Valor.Trim() })
                .ToList()
        });
    }

    private static bool EsValorValido(TipoPregunta tipo, string valor) => tipo switch
    {
        TipoPregunta.Escala1a5 => int.TryParse(valor, out var n) && n is >= 1 and <= 5,
        TipoPregunta.SiNo => valor is "Si" or "No",
        TipoPregunta.TextoLibre => !string.IsNullOrWhiteSpace(valor) && valor.Length <= RespuestaPregunta.ValorMax,
        _ => false
    };
}
