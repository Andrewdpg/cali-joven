import { NextFunction, Request, Response } from "express";
import { AppError } from "../exceptions";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    // Manejo de errores personalizados
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  } else {
    // Manejo de errores no controlados
    console.error("Unhandled Error:", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const errorWrapper = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next); // Captura errores y los pasa al middleware de errores
  };
};