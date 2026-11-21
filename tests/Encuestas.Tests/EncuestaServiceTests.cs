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
}
