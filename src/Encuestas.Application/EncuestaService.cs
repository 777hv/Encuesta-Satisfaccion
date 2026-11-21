using Encuestas.Domain;

namespace Encuestas.Application;

public record CrearEncuestaDto(string Titulo, string? Descripcion);

public class EncuestaService(IEncuestaRepository repo)
{
    public Task<List<Encuesta>> ListarAsync() => repo.ListarAsync();

    public Task<Encuesta?> ObtenerAsync(int id) => repo.ObtenerAsync(id);

    public async Task<Encuesta> CrearAsync(CrearEncuestaDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Titulo))
            throw new ArgumentException("El título es obligatorio.");

        return await repo.CrearAsync(new Encuesta
        {
            Titulo = dto.Titulo.Trim(),
            Descripcion = dto.Descripcion?.Trim()
        });
    }
}
