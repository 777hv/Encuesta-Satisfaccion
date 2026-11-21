using Encuestas.Domain;

namespace Encuestas.Application;

// La capa de aplicación solo conoce esta interfaz; la implementación con SQL Server vive en Infrastructure (la D de SOLID).
public interface IEncuestaRepository
{
    Task<List<Encuesta>> ListarAsync();
    Task<Encuesta?> ObtenerAsync(int id);
    Task<Encuesta> CrearAsync(Encuesta encuesta);
    Task ActualizarAsync(Encuesta encuesta);
    Task EliminarAsync(Encuesta encuesta);
    Task<Pregunta?> ObtenerPreguntaAsync(int encuestaId, int preguntaId);
    Task<Pregunta> CrearPreguntaAsync(Pregunta pregunta);
    Task ActualizarPreguntaAsync(Pregunta pregunta);
    Task EliminarPreguntaAsync(Pregunta pregunta);

}
