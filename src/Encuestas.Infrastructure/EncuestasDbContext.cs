using Encuestas.Domain;
using Microsoft.EntityFrameworkCore;

namespace Encuestas.Infrastructure;

public class EncuestasDbContext(DbContextOptions<EncuestasDbContext> options) : DbContext(options)
{
    public DbSet<Encuesta> Encuestas => Set<Encuesta>();
    public DbSet<Pregunta> Preguntas => Set<Pregunta>();

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
    }
}
