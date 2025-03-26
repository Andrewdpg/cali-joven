import { NextFunction, Request, Response } from "express";
import { AppError } from "../exceptions";

/**
 * Middleware global para el manejo de errores en la aplicación.
 * Distingue entre errores personalizados y errores no controlados.
 *
 * @param err - Error capturado durante la ejecución.
 * @param req - Objeto de solicitud de Express.
 * @param res - Objeto de respuesta de Express.
 * @param next - Función para pasar al siguiente middleware.
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
  if (err instanceof AppError) {
    // Manejo de errores definidos por la aplicación
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  } else {
    // Manejo de errores inesperados
    console.error("Unhandled Error:", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

/**
 * Función envolvente para manejar errores en controladores de manera asíncrona.
 * Captura cualquier error lanzado en funciones async y lo pasa al middleware de errores.
 *
 * @param fn - Función asincrónica que maneja una solicitud.
 * @returns Función que ejecuta la solicitud y captura errores automáticamente.
 */
export const errorWrapper = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next); // Captura errores y los pasa al middleware de manejo de errores
  };
};