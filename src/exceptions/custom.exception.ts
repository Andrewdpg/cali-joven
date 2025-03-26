/**
 * Clase base para errores personalizados en la aplicación.
 * Extiende la clase Error de JavaScript y agrega un código de estado HTTP.
 */
export class AppError extends Error {
  public readonly statusCode: number;

  /**
   * Crea una instancia de AppError.
   * @param message - Mensaje descriptivo del error.
   * @param statusCode - Código de estado HTTP asociado al error.
   */
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // Mantener el stack trace (solo en desarrollo)
    // TODO: Eliminar esta línea en producción para mejorar el rendimiento
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error específico para recursos no encontrados (404).
 */
export class NotFoundError extends AppError {
  /**
   * Crea una instancia de NotFoundError con un mensaje por defecto.
   * @param message - Mensaje descriptivo del error (opcional, por defecto "Resource not found").
   */
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

/**
 * Error específico para fallos de validación (400).
 */
export class ValidationError extends AppError {
  /**
   * Crea una instancia de ValidationError con un mensaje por defecto.
   * @param message - Mensaje descriptivo del error (opcional, por defecto "Validation failed").
   */
  constructor(message = "Validation failed") {
    super(message, 400);
  }
}

/**
 * Error específico para cuando un recurso ya existe (409 - Conflicto).
 */
export class AlreadyExistsError extends AppError {
  /**
   * Crea una instancia de AlreadyExistsError con un mensaje por defecto.
   * @param message - Mensaje descriptivo del error (opcional, por defecto "Already exists").
   */
  constructor(message = "Already exists") {
    super(message, 409);
  }
}
