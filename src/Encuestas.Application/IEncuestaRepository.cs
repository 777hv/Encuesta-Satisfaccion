using Encuestas.Domain;

namespace Encuestas.Application;

// La capa de aplicación solo conoce esta interfaz; la implementación con SQL Server vive en Infrastructure (la D de SOLID).
public interface IEncuestaRepository
{
    Task<List<Encuesta>> ListarAsync();
    Task<Encuesta?> ObtenerAsync(int id);
    Task<Encuesta> CrearAsync(Encuesta encuesta);
}
