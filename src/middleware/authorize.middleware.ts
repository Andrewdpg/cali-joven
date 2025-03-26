import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config";
import { TokenPayload } from "../types";

/**
 * Middleware para la autorización de usuarios basado en JWT.
 * Verifica si el usuario tiene un token válido y si posee las autoridades requeridas.
 *
 * @param requiredAuthorities - Lista opcional de autoridades necesarias para acceder a la ruta protegida.
 * @returns Middleware de autorización que valida el token y los permisos.
 */
export const authorize = (requiredAuthorities?: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Extraer el token del encabezado de autorización
    const token: string | undefined = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      res.status(401).send("Access denied. No token provided.");
      return;
    }

    try {
      // Verificar y decodificar el token
      const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
      req.body.payload = decoded;

      // Verificar si el token contiene las autoridades necesarias
      if (!decoded || !decoded.authorities) {
        res.status(403).json({ message: "Access denied. No authorities found." });
        return;
      }

      console.log("User authorities: ", decoded.authorities);

      // Comprobar si el usuario tiene al menos una de las autoridades requeridas
      const hasAuthority = requiredAuthorities && requiredAuthorities.some((authority) =>
          decoded.authorities.includes(authority)
      );

      /**
       * Alternativamente, si se requiere que el usuario tenga todas las autoridades especificadas:
       * const hasAuthority = requiredAuthorities.every((authority) =>
       *     decoded.authorities.includes(authority)
       * );
       */

      if (requiredAuthorities && !hasAuthority) {
        res.status(403).json({ message: "Access denied. Insufficient authorities." });
        return;
      }

      next(); // Continuar con la siguiente función en la cadena de middleware
    } catch (ex) {
      // Manejo de errores específicos
      if (ex instanceof jwt.TokenExpiredError) {
        res.status(401).send("Access denied. Token expired.");
        return;
      }
      res.status(400).send(ex);
    }
  };
};
