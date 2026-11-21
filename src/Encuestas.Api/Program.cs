using System.Text.Json.Serialization;
using Encuestas.Application;
using Encuestas.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddOpenApi();
builder.Services.AddInfrastructure(builder.Configuration.GetConnectionString("Encuestas")
    ?? throw new InvalidOperationException("Falta la cadena de conexión 'Encuestas' en appsettings.json."));
builder.Services.AddScoped<EncuestaService>();
builder.Services.AddScoped<RespuestaService>();
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p
    .WithOrigins(builder.Configuration["FrontendUrl"] ?? "http://localhost:5173")
    .AllowAnyHeader()
    .AllowAnyMethod()));

var app = builder.Build();

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseCors();
app.MapControllers();
app.Run();
