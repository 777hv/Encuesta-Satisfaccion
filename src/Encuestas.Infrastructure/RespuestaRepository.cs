using Microsoft.EntityFrameworkCore;
using Encuestas.Application;
using Encuestas.Domain;

namespace Encuestas.Infrastructure;

public class RespuestaRepository(EncuestasDbContext db) : IRespuestaRepository
{
    public async Task<Respuesta> CrearAsync(Respuesta respuesta)
    {
        db.Respuestas.Add(respuesta);
        await db.SaveChangesAsync();
        return respuesta;
    }

    public Task<int> ContarAsync(int encuestaId) =>
        db.Respuestas.CountAsync(r => r.EncuestaId == encuestaId);

    // shortcut: trae todos los valores a memoria; con decenas de miles de respuestas conviene agrupar en SQL.
    public Task<List<RespuestaPregunta>> ListarDetallesAsync(int encuestaId) =>
        db.Respuestas.AsNoTracking()
            .Where(r => r.EncuestaId == encuestaId)
            .SelectMany(r => r.Detalles)
            .ToListAsync();

}
