using Encuestas.Application;
using Microsoft.AspNetCore.Mvc;

namespace Encuestas.Api.Controllers;

// Endpoints que usa quien responde la encuesta (sin iniciar sesión).
[ApiController]
[Route("api/publico/encuestas/{encuestaId:int}")]
public class PublicoController(RespuestaService service) : ControllerBase
{
    [HttpPost("respuestas")]
    public async Task<IActionResult> Responder(int encuestaId, ResponderEncuestaDto dto)
    {
        var respuesta = await service.ResponderAsync(encuestaId, dto);
        return respuesta is null ? NotFound() : Created((string?)null, new { respuesta.Id });
    }

}
