namespace Encuestas.Domain;

public class Encuesta
{
    public int Id { get; set; }
    public string Titulo { get; set; } = "";
    public string? Descripcion { get; set; }
    public bool Activa { get; set; } = true;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    public List<Pregunta> Preguntas { get; set; } = [];
}

public class Pregunta
{
    public int Id { get; set; }
    public int EncuestaId { get; set; }
    public string Texto { get; set; } = "";
    public TipoPregunta Tipo { get; set; }
    public int Orden { get; set; }
}

public enum TipoPregunta
{
    Escala1a5,
    SiNo,
    TextoLibre
}
