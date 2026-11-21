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
        try
        {
            var pregunta = await service.CrearPreguntaAsync(encuestaId, dto);
            return pregunta is null ? NotFound() : Created($"/api/encuestas/{encuestaId}", pregunta);
        }
        catch (ArgumentException ex)
        {
            return ValidationProblem(ex.Message);
        }
    }

    [HttpPut("{preguntaId:int}")]
    public async Task<IActionResult> Actualizar(int encuestaId, int preguntaId, PreguntaDto dto)
    {
        try
        {
            return await service.ActualizarPreguntaAsync(encuestaId, preguntaId, dto) ? NoContent() : NotFound();
        }
        catch (ArgumentException ex)
        {
            return ValidationProblem(ex.Message);
        }
    }

    [HttpDelete("{preguntaId:int}")]
    public async Task<IActionResult> Eliminar(int encuestaId, int preguntaId) =>
        await service.EliminarPreguntaAsync(encuestaId, preguntaId) ? NoContent() : NotFound();
}
