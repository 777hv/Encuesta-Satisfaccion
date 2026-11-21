using Encuestas.Application;
using Encuestas.Domain;

namespace Encuestas.Tests;

public class ResultadoServiceTests
{
    // Calculadoras: se prueban solas, sin repositorios.

    [Fact]
    public void CalculadoraEscala_CalculaPromedioYDistribucion()
    {
        var resultado = (ResultadoEscala)new CalculadoraEscala().Calcular(["3", "4", "5", "5"]);

        Assert.Equal(4.25, resultado.Promedio);
        Assert.Equal(2, resultado.Distribucion[5]);
        Assert.Equal(0, resultado.Distribucion[1]);
    }

    [Fact]
    public void CalculadoraEscala_SinRespuestas_PromedioCero()
    {
        var resultado = (ResultadoEscala)new CalculadoraEscala().Calcular([]);

        Assert.Equal(0, resultado.Promedio);
    }

    [Fact]
    public void CalculadoraSiNo_CuentaCadaOpcion()
    {
        var resultado = (ResultadoSiNo)new CalculadoraSiNo().Calcular(["Si", "No", "Si"]);

        Assert.Equal(2, resultado.Si);
        Assert.Equal(1, resultado.No);
    }

    // Servicio: comprueba que reparte los valores a la pregunta correcta.

    [Fact]
    public async Task Obtener_AgrupaLosValoresPorPregunta()
    {
        var encuestas = new EncuestaServiceTests.RepoEnMemoria();
        encuestas.Datos.Add(new Encuesta
        {
            Id = 1,
            Titulo = "Encuesta",
            Preguntas =
            [
                new Pregunta { Id = 10, EncuestaId = 1, Texto = "Satisfacción", Tipo = TipoPregunta.Escala1a5, Orden = 1 },
                new Pregunta { Id = 11, EncuestaId = 1, Texto = "¿Recomendaría?", Tipo = TipoPregunta.SiNo, Orden = 2 }
            ]
        });

        var respuestas = new RespuestaServiceTests.RespuestasEnMemoria();
        respuestas.Datos.Add(new Respuesta
        {
            EncuestaId = 1,
            Detalles = [new() { PreguntaId = 10, Valor = "5" }, new() { PreguntaId = 11, Valor = "Si" }]
        });
        respuestas.Datos.Add(new Respuesta
        {
            EncuestaId = 1,
            Detalles = [new() { PreguntaId = 10, Valor = "3" }, new() { PreguntaId = 11, Valor = "No" }]
        });

        var service = new ResultadoService(encuestas, respuestas,
            [new CalculadoraEscala(), new CalculadoraSiNo(), new CalculadoraTexto()]);

        var resultado = await service.ObtenerAsync(1);

        Assert.NotNull(resultado);
        Assert.Equal(2, resultado.TotalRespuestas);
        Assert.Equal(4, ((ResultadoEscala)resultado.Preguntas[0].Resultado).Promedio);
        Assert.Equal(1, ((ResultadoSiNo)resultado.Preguntas[1].Resultado).No);
    }

    [Fact]
    public async Task Obtener_EncuestaInexistente_DevuelveNull()
    {
        var service = new ResultadoService(
            new EncuestaServiceTests.RepoEnMemoria(),
            new RespuestaServiceTests.RespuestasEnMemoria(),
            []);

        Assert.Null(await service.ObtenerAsync(99));
    }
}
