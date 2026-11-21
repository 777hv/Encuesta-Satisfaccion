using Encuestas.Domain;

namespace Encuestas.Application;

public record CrearEncuestaDto(string Titulo, string? Descripcion);
public record ActualizarEncuestaDto(string Titulo, string? Descripcion, bool Activa);
public record PreguntaDto(string Texto, TipoPregunta Tipo, int Orden);
public class EncuestaService(IEncuestaRepository repo)
{
    public Task<List<Encuesta>> ListarAsync() => repo.ListarAsync();

    public Task<Encuesta?> ObtenerAsync(int id) => repo.ObtenerAsync(id);

    public async Task<Encuesta> CrearAsync(CrearEncuestaDto dto)
    {
        ValidarEncuesta(dto.Titulo, dto.Descripcion);

        return await repo.CrearAsync(new Encuesta
        {
            Titulo = dto.Titulo.Trim(),
            Descripcion = dto.Descripcion?.Trim()
        });
    }

    public async Task<bool> ActualizarAsync(int id, ActualizarEncuestaDto dto)
    {
        ValidarEncuesta(dto.Titulo, dto.Descripcion);

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

        public async Task<Pregunta?> CrearPreguntaAsync(int encuestaId, PreguntaDto dto)
    {
        ValidarPregunta(dto);

        if (await repo.ObtenerAsync(encuestaId) is null)
            return null;

        return await repo.CrearPreguntaAsync(new Pregunta
        {
            EncuestaId = encuestaId,
            Texto = dto.Texto.Trim(),
            Tipo = dto.Tipo,
            Orden = dto.Orden
        });
    }

    public async Task<bool> ActualizarPreguntaAsync(int encuestaId, int preguntaId, PreguntaDto dto)
    {
        ValidarPregunta(dto);

        var pregunta = await repo.ObtenerPreguntaAsync(encuestaId, preguntaId);
        if (pregunta is null)
            return false;

        pregunta.Texto = dto.Texto.Trim();
        pregunta.Tipo = dto.Tipo;
        pregunta.Orden = dto.Orden;

        await repo.ActualizarPreguntaAsync(pregunta);
        return true;
    }

    public async Task<bool> EliminarPreguntaAsync(int encuestaId, int preguntaId)
    {
        var pregunta = await repo.ObtenerPreguntaAsync(encuestaId, preguntaId);
        if (pregunta is null)
            return false;

        await repo.EliminarPreguntaAsync(pregunta);
        return true;
    }

    private static void ValidarEncuesta(string titulo, string? descripcion)
    {
        if (string.IsNullOrWhiteSpace(titulo))
            throw new ValidacionException("El título es obligatorio.");

        if (titulo.Trim().Length > Encuesta.TituloMax)
            throw new ValidacionException($"El título no puede superar {Encuesta.TituloMax} caracteres.");

        if (descripcion?.Trim().Length > Encuesta.DescripcionMax)
            throw new ValidacionException($"La descripción no puede superar {Encuesta.DescripcionMax} caracteres.");
    }

    private static void ValidarPregunta(PreguntaDto dto)
    {

        if (string.IsNullOrWhiteSpace(dto.Texto))
            throw new ValidacionException("El texto de la pregunta es obligatorio.");

        if (dto.Texto.Trim().Length > Pregunta.TextoMax)
            throw new ValidacionException($"El texto de la pregunta no puede superar {Pregunta.TextoMax} caracteres.");

        if (!Enum.IsDefined(dto.Tipo))
            throw new ValidacionException("El tipo de pregunta no es válido.");
    }

}
