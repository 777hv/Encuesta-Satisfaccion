# Etapa 1: compilar con el SDK
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Primero solo los .csproj: si no cambian, Docker reutiliza la capa del restore y el build es más rápido.
COPY Directory.Build.props nuget.config ./
COPY src/Encuestas.Domain/Encuestas.Domain.csproj src/Encuestas.Domain/
COPY src/Encuestas.Application/Encuestas.Application.csproj src/Encuestas.Application/
COPY src/Encuestas.Infrastructure/Encuestas.Infrastructure.csproj src/Encuestas.Infrastructure/
COPY src/Encuestas.Api/Encuestas.Api.csproj src/Encuestas.Api/
RUN dotnet restore src/Encuestas.Api/Encuestas.Api.csproj

COPY src/ src/
RUN dotnet publish src/Encuestas.Api/Encuestas.Api.csproj -c Release -o /app --no-restore

# Etapa 2: ejecutar con una imagen pequeña, sin SDK
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app .
# La imagen de .NET ya escucha en el puerto 8080 y trae un usuario sin privilegios.
USER $APP_UID
EXPOSE 8080
ENTRYPOINT ["dotnet", "Encuestas.Api.dll"]
