/**
 * Módulo de Tipos para Autenticación
 *
 * Este módulo define los tipos utilizados en el proceso de autenticación, incluyendo
 * las credenciales de inicio de sesión, la respuesta de autenticación y la carga útil del token.
 */

import { CommonResponse } from "./common.types";
import { UserPublic } from "./user.types";

/**
 * Tipo `AuthLogin`
 *
 * Representa las credenciales de un usuario para el inicio de sesión.
 *
 * @property {string} email - Correo electrónico del usuario.
 * @property {string} password - Contraseña del usuario.
 */
export type AuthLogin = {
  email: string;
  password: string;
};

/**
 * Tipo `AuthLoginResponse`
 *
 * Representa la respuesta obtenida tras un inicio de sesión exitoso.
 * Hereda `CommonResponse` y añade información del usuario autenticado.
 *
 * @property {UserPublic} user - Información pública del usuario autenticado.
 * @property {string} token - Token JWT generado para la sesión del usuario.
 */
export type AuthLoginResponse = CommonResponse & {
  user: UserPublic;
  token: string;
};

/**
 * Tipo `TokenPayload`
 *
 * Representa la carga útil (payload) incluida en un token JWT para la autenticación del usuario.
 *
 * @property {string} user_id - Identificador único del usuario autenticado.
 * @property {string[]} authorities - Lista de roles o permisos asignados al usuario.
 */
export type TokenPayload = {
  user_id: string;
  authorities: string[];
};
