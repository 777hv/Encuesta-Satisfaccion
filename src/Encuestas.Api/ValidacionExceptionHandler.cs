using Encuestas.Application;
using Microsoft.AspNetCore.Diagnostics;

namespace Encuestas.Api;

// Un solo lugar que traduce errores a HTTP: ValidacionException → 400. Las demás excepciones siguen al manejador por defecto (500).
public class ValidacionExceptionHandler(IProblemDetailsService problemDetails) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken cancellationToken)
    {
        if (exception is not ValidacionException)
            return false;

        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        return await problemDetails.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = context,
            Exception = exception,
            ProblemDetails = { Title = "Datos no válidos", Detail = exception.Message, Status = 400 }
        });
    }
}
