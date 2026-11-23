using Encuestas.Application;
using Encuestas.Domain;

namespace Encuestas.Tests;

public class TraduccionServiceTests
{
    // Traductor falso: marca cada texto con el idioma para ver qué se tradujo, sin llamar a Azure.
    private sealed class TraductorFalso : ITraductor
    {
        public Task<List<string>> TraducirAsync(List<string> textos, string idioma) =>
            Task.FromResult(textos.Select(t => $"[{idioma}] {t}").ToList());
    }

    private static Encuesta NuevaEncuesta() => new()
    {
        Titulo = "Satisfacción",
        Descripcion = "Breve",
        Preguntas = [new Pregunta { Texto = "¿Cómo te atendimos?", Tipo = TipoPregunta.Escala1a5 }]
    };

    [Fact]
    public async Task TraducirEncuesta_TraduceTituloYPreguntas()
    {
        var encuesta = NuevaEncuesta();

        await new TraduccionService(new TraductorFalso()).TraducirEncuestaAsync(encuesta, "en");

        Assert.Equal("[en] Satisfacción", encuesta.Titulo);
        Assert.Equal("[en] Breve", encuesta.Descripcion);
        Assert.Equal("[en] ¿Cómo te atendimos?", encuesta.Preguntas[0].Texto);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("fr")]
    public async Task TraducirEncuesta_IdiomaNoSoportado_NoCambiaNada(string? idioma)
    {
        var encuesta = NuevaEncuesta();

        await new TraduccionService(new TraductorFalso()).TraducirEncuestaAsync(encuesta, idioma);

        Assert.Equal("Satisfacción", encuesta.Titulo);
    }

    [Fact]
    public async Task TraducirComentarios_SoloTraduceTextoLibre()
    {
        var resultado = new ResultadoEncuesta(1, "Título", 2,
        [
            new ResultadoPregunta(1, "¿Algo más?", "TextoLibre", new ResultadoTexto(["Muy bien"])),
            new ResultadoPregunta(2, "¿Volverías?", "SiNo", new ResultadoSiNo(2, 0)),
        ], EstiloEncuesta.Petroleo);

        await new TraduccionService(new TraductorFalso()).TraducirComentariosAsync(resultado, "en");

        var comentarios = ((ResultadoTexto)resultado.Preguntas[0].Resultado).Comentarios;
        Assert.Equal("[en] Muy bien", Assert.Single(comentarios));
        Assert.Equal("Título", resultado.Titulo);
    }
}
