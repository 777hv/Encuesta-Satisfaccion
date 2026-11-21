using Encuestas.Application;
using Encuestas.Domain;

namespace Encuestas.Tests;

public class EncuestaServiceTests
{
    // Repositorio falso en memoria: prueba la lógica sin base de datos.
    private sealed class RepoEnMemoria : IEncuestaRepository
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

}
