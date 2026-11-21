using Encuestas.Application;
using Encuestas.Domain;

namespace Encuestas.Tests;

public class EncuestaServiceTests
{
    // Repositorio falso en memoria: prueba la lógica sin base de datos.
    internal sealed class RepoEnMemoria : IEncuestaRepository
    {
        public List<Encuesta> Datos { get; } = [];
        public Task<List<Encuesta>> ListarAsync() => Task.FromResult(Datos);
        public Task<Encuesta?> ObtenerAsync(int id) => Task.FromResult(Datos.FirstOrDefault(e => e.Id == id));
        public Task<Encuesta> CrearAsync(Encuesta e)
        {
            e.Id = Datos.Count + 1;
            Datos.Add(e);
            return Task.FromResult(e);
        }

        public Task ActualizarAsync(Encuesta e) => Task.CompletedTask;

        public Task EliminarAsync(Encuesta e)
        {
            Datos.Remove(e);
            return Task.CompletedTask;
        }

        public List<Pregunta> Preguntas { get; } = [];

        public Task<Pregunta?> ObtenerPreguntaAsync(int encuestaId, int preguntaId) =>
            Task.FromResult(Preguntas.FirstOrDefault(p => p.Id == preguntaId && p.EncuestaId == encuestaId));

        public Task<Pregunta> CrearPreguntaAsync(Pregunta p)
        {
            p.Id = Preguntas.Count + 1;
            Preguntas.Add(p);
            return Task.FromResult(p);
        }

        public Task ActualizarPreguntaAsync(Pregunta p) => Task.CompletedTask;

        public Task EliminarPreguntaAsync(Pregunta p)
        {
            Preguntas.Remove(p);
            return Task.CompletedTask;
        }

    }

    [Fact]
    public async Task Crear_ConTituloVacio_LanzaError()
    {
        var service = new EncuestaService(new RepoEnMemoria());

        await Assert.ThrowsAsync<ArgumentException>(() => service.CrearAsync(new CrearEncuestaDto("   ", null)));
    }

    [Fact]
    public async Task Crear_GuardaConTituloSinEspacios()
    {
        var repo = new RepoEnMemoria();
        var service = new EncuestaService(repo);

        var encuesta = await service.CrearAsync(new CrearEncuestaDto("  Satisfacción  ", null));

        Assert.Equal("Satisfacción", encuesta.Titulo);
        Assert.Single(repo.Datos);
    }

    [Fact]
    public async Task Actualizar_IdInexistente_DevuelveFalse()
    {
        var service = new EncuestaService(new RepoEnMemoria());

        var resultado = await service.ActualizarAsync(99, new ActualizarEncuestaDto("Nuevo", null, true));

        Assert.False(resultado);
    }

    [Fact]
    public async Task Eliminar_Existente_LaQuitaDeLaLista()
    {
        var repo = new RepoEnMemoria();
        var service = new EncuestaService(repo);
        var encuesta = await service.CrearAsync(new CrearEncuestaDto("Borrar", null));

        var resultado = await service.EliminarAsync(encuesta.Id);

        Assert.True(resultado);
        Assert.Empty(repo.Datos);
    }

    [Fact]
    public async Task CrearPregunta_EncuestaInexistente_DevuelveNull()
    {
        var service = new EncuestaService(new RepoEnMemoria());

        var pregunta = await service.CrearPreguntaAsync(99, new PreguntaDto("¿Volvería?", TipoPregunta.SiNo, 1));

        Assert.Null(pregunta);
    }

    [Fact]
    public async Task CrearPregunta_TipoInvalido_LanzaError()
    {
        var repo = new RepoEnMemoria();
        var service = new EncuestaService(repo);
        var encuesta = await service.CrearAsync(new CrearEncuestaDto("Encuesta", null));

        await Assert.ThrowsAsync<ArgumentException>(() =>
            service.CrearPreguntaAsync(encuesta.Id, new PreguntaDto("Texto", (TipoPregunta)7, 1)));
    }

    [Fact]
    public async Task EliminarPregunta_DeOtraEncuesta_DevuelveFalse()
    {
        var repo = new RepoEnMemoria();
        var service = new EncuestaService(repo);
        var encuesta = await service.CrearAsync(new CrearEncuestaDto("Encuesta", null));
        var pregunta = await service.CrearPreguntaAsync(encuesta.Id, new PreguntaDto("Texto", TipoPregunta.SiNo, 1));

        var resultado = await service.EliminarPreguntaAsync(encuesta.Id + 1, pregunta!.Id);

        Assert.False(resultado);
        Assert.Single(repo.Preguntas);
    }

}
