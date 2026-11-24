using Encuestas.Application;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Encuestas.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string connectionString)
    {
        // Azure SQL serverless se pausa; al despertar rechaza conexiones un rato, así que reintentamos.
        services.AddDbContext<EncuestasDbContext>(o =>
            o.UseSqlServer(connectionString, sql => sql.EnableRetryOnFailure()));
        services.AddScoped<IEncuestaRepository, EncuestaRepository>();
        services.AddScoped<IRespuestaRepository, RespuestaRepository>();
        return services;
    }
}
