using Encuestas.Application;
using Encuestas.Domain;

namespace Encuestas.Tests;

public class RespuestaServiceTests
{
    internal sealed class RespuestasEnMemoria : IRespuestaRepository
    {
        public List<Respuesta> Datos { get; } = [];
        public Task<Respuesta> CrearAsync(Respuesta r)
        {
            r.Id = Datos.Count + 1;
            Datos.Add(r);
            return Task.FromResult(r);
        }

        public Task<int> ContarAsync(int encuestaId) =>
            Task.FromResult(Datos.Count(r => r.EncuestaId == encuestaId));

        public Task<List<RespuestaPregunta>> ListarDetallesAsync(int encuestaId) =>
            Task.FromResult(Datos.Where(r => r.EncuestaId == encuestaId).SelectMany(r => r.Detalles).ToList());

    }

    private readonly EncuestaServiceTests.RepoEnMemoria encuestas = new();
    private readonly RespuestasEnMemoria respuestas = new();
    private readonly RespuestaService service;

    // xUnit crea una instancia nueva por cada prueba: cada una empieza con datos limpios.
    public RespuestaServiceTests()
    {
        encuestas.Datos.Add(new Encuesta
        {
            Id = 1,
            Titulo = "Encuesta",
            Preguntas =
            [
                new Pregunta { Id = 10, EncuestaId = 1, Texto = "Satisfacción", Tipo = TipoPregunta.Escala1a5 },
                new Pregunta { Id = 11, EncuestaId = 1, Texto = "¿Recomendaría?", Tipo = TipoPregunta.SiNo }
            ]
        });
        service = new RespuestaService(encuestas, respuestas);
    }

    [Fact]
    public async Task Responder_Valido_GuardaUnDetallePorPregunta()
    {
        var respuesta = await service.ResponderAsync(1, new ResponderEncuestaDto(
            [new RespuestaPreguntaDto(10, "4"), new RespuestaPreguntaDto(11, "Si")]));

        Assert.NotNull(respuesta);
        Assert.Equal(2, respuestas.Datos.Single().Detalles.Count);
    }

    [Fact]
    public async Task Responder_EncuestaInexistente_DevuelveNull()
    {
        var respuesta = await service.ResponderAsync(99, new ResponderEncuestaDto([]));

        Assert.Null(respuesta);
    }

    [Theory]
    [InlineData("0")]
    [InlineData("6")]
    [InlineData("cuatro")]
    public async Task Responder_EscalaInvalida_LanzaError(string valor)
    {
        await Assert.ThrowsAsync<ValidacionException>(() => service.ResponderAsync(1, new ResponderEncuestaDto(
            [new RespuestaPreguntaDto(10, valor), new RespuestaPreguntaDto(11, "Si")])));

        Assert.Empty(respuestas.Datos);
    }

    [Fact]
    public async Task Responder_FaltaUnaPregunta_LanzaError()
    {
        await Assert.ThrowsAsync<ValidacionException>(() => service.ResponderAsync(1, new ResponderEncuestaDto(
            [new RespuestaPreguntaDto(10, "4")])));
    }

    [Fact]
    public async Task ObtenerParaResponder_Activa_DevuelveEncuesta()
    {
        var encuesta = await service.ObtenerParaResponderAsync(1);

        Assert.NotNull(encuesta);
        Assert.Equal(2, encuesta.Preguntas.Count);
    }

    [Fact]
    public async Task ObtenerParaResponder_Inactiva_DevuelveNull()
    {
        encuestas.Datos.Single().Activa = false;

        Assert.Null(await service.ObtenerParaResponderAsync(1));
    }

}
