using Encuestas.Domain;

namespace Encuestas.Application;

public record CrearEncuestaDto(string Titulo, string? Descripcion);
public record ActualizarEncuestaDto(string Titulo, string? Descripcion, bool Activa);
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

    public async Task<bool> ActualizarAsync(int id, ActualizarEncuestaDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Titulo))
            throw new ArgumentException("El título es obligatorio.");

        var encuesta = await repo.ObtenerAsync(id);
        if (encuesta is null)
            return false;

        encuesta.Titulo = dto.Titulo.Trim();
        encuesta.Descripcion = dto.Descripcion?.Trim();
        encuesta.Activa = dto.Activa;

        await repo.ActualizarAsync(encuesta);
        return true;
    }

    public async Task<bool> EliminarAsync(int id)
    {
        var encuesta = await repo.ObtenerAsync(id);
        if (encuesta is null)
            return false;

        await repo.EliminarAsync(encuesta);
        return true;
    }

}
