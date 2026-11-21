using Encuestas.Domain;

namespace Encuestas.Application;

public record ResultadoEscala(double Promedio, Dictionary<int, int> Distribucion);
public record ResultadoSiNo(int Si, int No);
public record ResultadoTexto(List<string> Comentarios);

// La O de SOLID: un tipo de pregunta nuevo = una clase nueva, sin modificar ResultadoService.
public interface ICalculadoraResultado
{
    TipoPregunta Tipo { get; }
    object Calcular(List<string> valores);
}

public class CalculadoraEscala : ICalculadoraResultado
{
    public TipoPregunta Tipo => TipoPregunta.Escala1a5;

    public object Calcular(List<string> valores)
    {
        var numeros = valores.Select(int.Parse).ToList();
        return new ResultadoEscala(
            numeros.Count == 0 ? 0 : Math.Round(numeros.Average(), 2),
            Enumerable.Range(1, 5).ToDictionary(n => n, n => numeros.Count(x => x == n)));
    }
}

public class CalculadoraSiNo : ICalculadoraResultado
{
    public TipoPregunta Tipo => TipoPregunta.SiNo;

    public object Calcular(List<string> valores) =>
        new ResultadoSiNo(valores.Count(v => v == "Si"), valores.Count(v => v == "No"));
}

public class CalculadoraTexto : ICalculadoraResultado
{
    public TipoPregunta Tipo => TipoPregunta.TextoLibre;

    public object Calcular(List<string> valores) => new ResultadoTexto(valores);
}
