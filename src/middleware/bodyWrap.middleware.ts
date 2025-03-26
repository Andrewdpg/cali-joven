import { NextFunction, Request, Response } from "express";

/**
 * Middleware para envolver el cuerpo de la solicitud en un objeto con la clave `data`.
 * Esto ayuda a mantener un formato consistente en las peticiones entrantes.
 *
 * @param req - Objeto de solicitud de Express.
 * @param res - Objeto de respuesta de Express.
 * @param next - Función para pasar al siguiente middleware.
 */
export const wrapBody = (req: Request, res: Response, next: NextFunction): void => {
  req.body = { data: req.body }; // Envuelve el cuerpo en un objeto `data`
  next(); // Continúa con el siguiente middleware
};
