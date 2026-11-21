namespace Encuestas.Application;

public record ResultadoPregunta(int PreguntaId, string Texto, string Tipo, object Resultado);
public record ResultadoEncuesta(int EncuestaId, string Titulo, int TotalRespuestas, List<ResultadoPregunta> Preguntas);

public class ResultadoService(
    IEncuestaRepository encuestas,
    IRespuestaRepository respuestas,
    IEnumerable<ICalculadoraResultado> calculadoras)
{
    public async Task<ResultadoEncuesta?> ObtenerAsync(int encuestaId)
    {
        var encuesta = await encuestas.ObtenerAsync(encuestaId);
        if (encuesta is null)
            return null;

        var total = await respuestas.ContarAsync(encuestaId);
        var valoresPorPregunta = (await respuestas.ListarDetallesAsync(encuestaId))
            .ToLookup(d => d.PreguntaId, d => d.Valor);
        var calculadoraPorTipo = calculadoras.ToDictionary(c => c.Tipo);

        var preguntas = encuesta.Preguntas
            .OrderBy(p => p.Orden)
            .Select(p => new ResultadoPregunta(
                p.Id,
                p.Texto,
                p.Tipo.ToString(),
                calculadoraPorTipo[p.Tipo].Calcular(valoresPorPregunta[p.Id].ToList())))
            .ToList();

        return new ResultadoEncuesta(encuesta.Id, encuesta.Titulo, total, preguntas);
    }
}
