namespace Encuestas.Domain;

public class Encuesta
{
    public const int TituloMax = 200;
    public const int DescripcionMax = 1000;
    public int Id { get; set; }
    public string Titulo { get; set; } = "";
    public string? Descripcion { get; set; }
    public bool Activa { get; set; } = true;
    public Tematica Tematica { get; set; } = Tematica.General;
    public EstiloEncuesta Estilo { get; set; } = EstiloEncuesta.Petroleo;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    public List<Pregunta> Preguntas { get; set; } = [];
}

public class Pregunta
{
    public const int TextoMax = 500;
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


public enum Tematica
{
    General,
    AtencionCliente,
    Producto,
    Evento,
    Empleados,
    Educacion
}

public enum EstiloEncuesta
{
    Petroleo,
    Coral,
    Lavanda,
    Bosque,
    Ambar,
    Grafito
}
