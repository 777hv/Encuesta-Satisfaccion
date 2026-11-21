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
}
