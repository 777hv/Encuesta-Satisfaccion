using Encuestas.Application;
using Microsoft.AspNetCore.Mvc;

namespace Encuestas.Api.Controllers;

[ApiController]
[Route("api/encuestas/{encuestaId:int}/resultados")]
public class ResultadosController(ResultadoService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Obtener(int encuestaId) =>
        await service.ObtenerAsync(encuestaId) is { } resultado ? Ok(resultado) : NotFound();
}
