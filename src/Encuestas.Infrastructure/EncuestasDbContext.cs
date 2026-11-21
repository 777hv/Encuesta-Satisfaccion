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
            e.Property(x => x.Titulo).HasMaxLength(200).IsRequired();
            e.Property(x => x.Descripcion).HasMaxLength(1000);
        });

        modelBuilder.Entity<Pregunta>(e =>
        {
            e.Property(x => x.Texto).HasMaxLength(500).IsRequired();
            e.Property(x => x.Tipo).HasConversion<string>().HasMaxLength(20);
        });

        modelBuilder.Entity<Respuesta>(e =>
        {
            e.HasOne<Encuesta>().WithMany().HasForeignKey(x => x.EncuestaId);
        });

        modelBuilder.Entity<RespuestaPregunta>(e =>
        {
            e.Property(x => x.Valor).HasMaxLength(2000).IsRequired();
            // shortcut: PreguntaId sin llave foránea para evitar el error de SQL Server "multiple cascade paths"; si se necesita integridad estricta, agregarla con OnDelete(Restrict).
        });

    }
}
