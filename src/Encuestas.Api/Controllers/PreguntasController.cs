using Encuestas.Application;
using Microsoft.AspNetCore.Mvc;

namespace Encuestas.Api.Controllers;

[ApiController]
[Route("api/encuestas/{encuestaId:int}/preguntas")]
public class PreguntasController(EncuestaService service) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Crear(int encuestaId, PreguntaDto dto)
    {
        var pregunta = await service.CrearPreguntaAsync(encuestaId, dto);
        return pregunta is null ? NotFound() : Created($"/api/encuestas/{encuestaId}", pregunta);
    }

    [HttpPut("{preguntaId:int}")]
    public async Task<IActionResult> Actualizar(int encuestaId, int preguntaId, PreguntaDto dto) =>
        await service.ActualizarPreguntaAsync(encuestaId, preguntaId, dto) ? NoContent() : NotFound();


    [HttpDelete("{preguntaId:int}")]
    public async Task<IActionResult> Eliminar(int encuestaId, int preguntaId) =>
        await service.EliminarPreguntaAsync(encuestaId, preguntaId) ? NoContent() : NotFound();
}
