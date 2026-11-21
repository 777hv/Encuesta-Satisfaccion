using Encuestas.Domain;

namespace Encuestas.Application;

// Interfaz separada de IEncuestaRepository: cada una con un solo propósito (la I de SOLID).
public interface IRespuestaRepository
{
    Task<Respuesta> CrearAsync(Respuesta respuesta);
    Task<int> ContarAsync(int encuestaId);
    Task<List<RespuestaPregunta>> ListarDetallesAsync(int encuestaId);
}
