using Encuestas.Application;
using Encuestas.Domain;
using Microsoft.EntityFrameworkCore;

namespace Encuestas.Infrastructure;

public class EncuestaRepository(EncuestasDbContext db) : IEncuestaRepository
{
    public Task<List<Encuesta>> ListarAsync() =>
        db.Encuestas.AsNoTracking().OrderByDescending(e => e.FechaCreacion).ToListAsync();

    public Task<Encuesta?> ObtenerAsync(int id) =>
        db.Encuestas.AsNoTracking().Include(e => e.Preguntas).FirstOrDefaultAsync(e => e.Id == id);

    public async Task<Encuesta> CrearAsync(Encuesta encuesta)
    {
        db.Encuestas.Add(encuesta);
        await db.SaveChangesAsync();
        return encuesta;

    }

    public async Task ActualizarAsync(Encuesta encuesta)
    {

        db.Encuestas.Update(encuesta);
        await db.SaveChangesAsync();
    }

    public async Task EliminarAsync(Encuesta encuesta)
    {
        db.Encuestas.Remove(encuesta);
        await db.SaveChangesAsync();
    }

}
