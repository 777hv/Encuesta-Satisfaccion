using Encuestas.Application;
using Microsoft.AspNetCore.Mvc;

namespace Encuestas.Api.Controllers;

[ApiController]
[Route("api/encuestas/{encuestaId:int}/resultados")]
public class ResultadosController(ResultadoService service, TraduccionService traduccion) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Obtener(int encuestaId, [FromQuery] string? idioma)
    {
        var resultado = await service.ObtenerAsync(encuestaId);
        if (resultado is null)
            return NotFound();

        await traduccion.TraducirComentariosAsync(resultado, idioma);
        return Ok(resultado);
    }
}
