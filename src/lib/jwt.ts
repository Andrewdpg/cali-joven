/**
 * Módulo para la generación de tokens JWT.
 *
 * Este módulo permite generar tokens JWT seguros utilizando un secreto almacenado en la configuración.
 * Se usa para autenticar usuarios y permitir acceso a recursos protegidos en la aplicación.
 */

import jwt from "jsonwebtoken";
import { env } from "../config";
import { TokenPayload } from "../types";

/**
 * Genera un token JWT a partir de un payload dado.
 *
 * @param {TokenPayload} payload - Datos a incluir en el token.
 * @returns {Promise<string>} Promesa que resuelve con el token generado o rechaza con un error.
 */
function generateToken(payload: TokenPayload): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!env.JWT_SECRET) {
            return reject(new Error("JWT_SECRET is not defined"));
        }

        jwt.sign(
            payload,
            env.JWT_SECRET,
            {
                expiresIn: "30d", // El token expira en 30 días.
            },
            (err, token) => {
                if (err) {
                    reject(err); // Error en la generación del token.
                } else if (!token) {
                    reject(new Error("Token generation failed")); // No se generó el token correctamente.
                } else {
                    resolve(token); // Se genera y retorna el token exitosamente.
                }
            }
        );
    });
}

export { generateToken };
