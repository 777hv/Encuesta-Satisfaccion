using Encuestas.Application;
using Microsoft.AspNetCore.Mvc;

namespace Encuestas.Api.Controllers;

[ApiController]
[Route("api/encuestas")]
public class EncuestasController(EncuestaService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Listar() => Ok(await service.ListarAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Obtener(int id) =>
        await service.ObtenerAsync(id) is { } encuesta ? Ok(encuesta) : NotFound();

    [HttpPost]
    public async Task<IActionResult> Crear(CrearEncuestaDto dto)
    {
        try
        {
            var encuesta = await service.CrearAsync(dto);
            return CreatedAtAction(nameof(Obtener), new { id = encuesta.Id }, encuesta);
        }
        catch (ArgumentException ex)
        {
            return ValidationProblem(ex.Message);
        }
    }
}
