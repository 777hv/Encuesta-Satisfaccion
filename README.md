# Encuestas de satisfacción

[![CI](https://github.com/777hv/Encuesta-Satisfaccion/actions/workflows/ci.yml/badge.svg)](https://github.com/777hv/Encuesta-Satisfaccion/actions/workflows/ci.yml)

Aplicación full stack para crear encuestas de satisfacción, responderlas desde un enlace público y ver sus resultados.

## Tecnologías
- **Backend:** ASP.NET Core 10 (Web API), Entity Framework Core, SQL Server
- **Frontend:** React 18 + Vite
- **Calidad:** xUnit, GitHub Actions (CI)
- **Despliegue:** Docker, Azure App Service + Azure SQL

## Arquitectura
```
src/
  Encuestas.Domain          Entidades (Encuesta, Pregunta, Respuesta). No depende de nada.
  Encuestas.Application     Casos de uso e interfaces (IEncuestaRepository).
  Encuestas.Infrastructure  EF Core + SQL Server: implementa las interfaces.
  Encuestas.Api             Controladores HTTP y configuración.
tests/
  Encuestas.Tests           Pruebas unitarias de la capa de aplicación.
frontend/                   React + Vite.
```
Las dependencias apuntan hacia adentro (Api → Application → Domain) e Infrastructure implementa las interfaces de Application. Así se aplica la inversión de dependencias (SOLID).

## Cómo correrlo
```bash
dotnet test Encuestas.slnx
dotnet ef database update -p src/Encuestas.Infrastructure -s src/Encuestas.Api
dotnet run --project src/Encuestas.Api        # http://localhost:5080
cd frontend && npm install && npm run dev     # http://localhost:5173
```

### Con Docker (API + SQL Server)
```bash
cp .env.example .env                          # y cambia la contraseña
docker compose up -d --build                  # API en http://localhost:5080
dotnet ef database update -p src/Encuestas.Infrastructure -s src/Encuestas.Api --connection "Server=localhost,1433;Database=EncuestasDb;User Id=sa;Password=<tu clave>;TrustServerCertificate=True"
cd frontend && npm install && npm run dev
```

## Estado
- [x] Crear y listar encuestas
- [x] Editar y eliminar encuestas
- [x] Preguntas por encuesta (crear, editar, eliminar; tipos Escala 1 a 5, Sí/No y Texto libre)
- [x] Responder encuesta desde un enlace público (solo encuestas activas)
- [x] Resultados con gráficas (promedio y distribución, Sí/No, comentarios)
- [ ] Despliegue en Azure
