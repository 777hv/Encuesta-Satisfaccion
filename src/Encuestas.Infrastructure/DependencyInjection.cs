using Encuestas.Application;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Encuestas.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<EncuestasDbContext>(o => o.UseSqlServer(connectionString));
        services.AddScoped<IEncuestaRepository, EncuestaRepository>();
        return services;
    }
}
