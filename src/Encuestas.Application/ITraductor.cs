namespace Encuestas.Application;

// La capa Application no sabe que existe Azure: solo pide "traduce estos textos".
public interface ITraductor
{
    Task<List<string>> TraducirAsync(List<string> textos, string idioma);
}
