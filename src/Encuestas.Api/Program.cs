using Encuestas.Api;
using System.Text.Json.Serialization;
using Encuestas.Application;
using Encuestas.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ValidacionExceptionHandler>();
builder.Services.AddInfrastructure(builder.Configuration.GetConnectionString("Encuestas")
    ?? throw new InvalidOperationException("Falta la cadena de conexión 'Encuestas' en appsettings.json."));
builder.Services.AddScoped<EncuestaService>();
builder.Services.AddScoped<RespuestaService>();
builder.Services.AddScoped<ResultadoService>();
builder.Services.AddScoped<TraduccionService>();

// La clave viene de user-secrets (local) o de variables de entorno (Azure). Nunca del repositorio.
var claveTraductor = builder.Configuration["Traductor:Clave"];
if (string.IsNullOrWhiteSpace(claveTraductor))
{
    builder.Services.AddSingleton<ITraductor, SinTraductor>();
}
else
{
    builder.Services.AddMemoryCache();
    builder.Services.AddSingleton(new OpcionesTraductor(
        claveTraductor,
        builder.Configuration["Traductor:Region"] ?? "canadacentral"));
    builder.Services.AddHttpClient<ITraductor, AzureTraductor>(c =>
        c.BaseAddress = new Uri("https://api.cognitive.microsofttranslator.com/"));
}

builder.Services.AddSingleton<ICalculadoraResultado, CalculadoraEscala>();
builder.Services.AddSingleton<ICalculadoraResultado, CalculadoraSiNo>();
builder.Services.AddSingleton<ICalculadoraResultado, CalculadoraTexto>();
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p
    .WithOrigins(builder.Configuration["FrontendUrl"] ?? "http://localhost:5173")
    .AllowAnyHeader()
    .AllowAnyMethod()));

var app = builder.Build();
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseCors();
app.MapControllers();
app.Run();
