namespace Encuestas.Application;

// Datos del cliente no válidos. El manejador global de la API la convierte en un 400.
public class ValidacionException(string mensaje) : Exception(mensaje);
