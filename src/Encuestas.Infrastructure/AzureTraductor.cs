using System.Net.Http.Json;
using System.Text.Json;
using Encuestas.Application;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace Encuestas.Infrastructure;

public record OpcionesTraductor(string Clave, string Region);

// Traduce con Azure AI Translator. Si falla, devuelve el texto original para no romper la página.
public class AzureTraductor(
    HttpClient http,
    OpcionesTraductor opciones,
    IMemoryCache cache,
    ILogger<AzureTraductor> logger) : ITraductor
{
    public async Task<List<string>> TraducirAsync(List<string> textos, string idioma)
    {
        var resultado = new List<string>(textos);

        // Solo se envía a Azure lo que no está en caché (el plan gratuito tiene límite mensual).
        // shortcut: caché en memoria de un solo servidor; si la app escala a varias instancias, usar una caché distribuida (Redis).
        var pendientes = new List<int>();
        for (var i = 0; i < textos.Count; i++)
        {
            if (cache.TryGetValue(Clave(idioma, textos[i]), out string? enCache))
                resultado[i] = enCache!;
            else if (!string.IsNullOrWhiteSpace(textos[i]))
                pendientes.Add(i);
        }
        if (pendientes.Count == 0)
            return resultado;

        try
        {
            using var solicitud = new HttpRequestMessage(HttpMethod.Post, $"translate?api-version=3.0&to={idioma}")
            {
                Content = JsonContent.Create(pendientes.Select(i => new { text = textos[i] }))
            };
            solicitud.Headers.Add("Ocp-Apim-Subscription-Key", opciones.Clave);
            solicitud.Headers.Add("Ocp-Apim-Subscription-Region", opciones.Region);

            using var respuesta = await http.SendAsync(solicitud);
            respuesta.EnsureSuccessStatusCode();
            var traducciones = await respuesta.Content.ReadFromJsonAsync<List<RespuestaAzure>>() ?? [];

            for (var j = 0; j < pendientes.Count && j < traducciones.Count; j++)
            {
                var traducido = traducciones[j].Translations[0].Text;
                resultado[pendientes[j]] = traducido;
                cache.Set(Clave(idioma, textos[pendientes[j]]), traducido, TimeSpan.FromDays(1));
            }
        }
        catch (Exception e) when (e is HttpRequestException or TaskCanceledException or JsonException)
        {
            logger.LogWarning(e, "No se pudo traducir a {Idioma}; se muestra el texto original.", idioma);
        }

        return resultado;
    }

    private static string Clave(string idioma, string texto) => $"traduccion:{idioma}:{texto}";

    // Forma de la respuesta de Azure: [ { "translations": [ { "text": "..." } ] } ]
    private record RespuestaAzure(List<TraduccionAzure> Translations);
    private record TraduccionAzure(string Text);
}

// Se usa cuando no hay clave configurada (por ejemplo en el CI): deja los textos igual.
public class SinTraductor : ITraductor
{
    public Task<List<string>> TraducirAsync(List<string> textos, string idioma) => Task.FromResult(textos);
}
