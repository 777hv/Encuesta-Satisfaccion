using Encuestas.Domain;
using Microsoft.EntityFrameworkCore;

namespace Encuestas.Infrastructure;

public class EncuestasDbContext(DbContextOptions<EncuestasDbContext> options) : DbContext(options)
{
    public DbSet<Encuesta> Encuestas => Set<Encuesta>();
    public DbSet<Pregunta> Preguntas => Set<Pregunta>();
    public DbSet<Respuesta> Respuestas => Set<Respuesta>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Encuesta>(e =>
        {
            e.Property(x => x.Titulo).HasMaxLength(Encuesta.TituloMax).IsRequired();
            e.Property(x => x.Descripcion).HasMaxLength(Encuesta.DescripcionMax);
            e.Property(x => x.Tematica).HasConversion<string>().HasMaxLength(20);
            e.Property(x => x.Estilo).HasConversion<string>().HasMaxLength(20);
        });

        modelBuilder.Entity<Pregunta>(e =>
        {
            e.Property(x => x.Texto).HasMaxLength(Pregunta.TextoMax).IsRequired();
            e.Property(x => x.Tipo).HasConversion<string>().HasMaxLength(20);
        });

        modelBuilder.Entity<Respuesta>(e =>
        {
            e.HasOne<Encuesta>().WithMany().HasForeignKey(x => x.EncuestaId);
        });

        modelBuilder.Entity<RespuestaPregunta>(e =>
        {
            e.Property(x => x.Valor).HasMaxLength(RespuestaPregunta.ValorMax).IsRequired();
            // shortcut: PreguntaId sin llave foránea para evitar el error de SQL Server "multiple cascade paths"; si se necesita integridad estricta, agregarla con OnDelete(Restrict).
        });

    }
}
