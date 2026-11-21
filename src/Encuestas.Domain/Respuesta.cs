namespace Encuestas.Domain;

public class Respuesta
{
    public int Id { get; set; }
    public int EncuestaId { get; set; }
    public DateTime Fecha { get; set; } = DateTime.UtcNow;
    public List<RespuestaPregunta> Detalles { get; set; } = [];
}

public class RespuestaPregunta
{
    public int Id { get; set; }
    public int RespuestaId { get; set; }
    public int PreguntaId { get; set; }
    public string Valor { get; set; } = "";
}
