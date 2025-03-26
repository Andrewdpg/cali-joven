/**
 * Esquemas de validación para autenticación y gestión de usuarios.
 *
 * Estos esquemas utilizan `zod` para validar los datos de registro, inicio de sesión y cambio de contraseña.
 */

import { number, object, string } from "zod";

/**
 * Esquema de validación para el registro de usuarios.
 *
 * @property {string} name - Nombre del usuario. Es obligatorio.
 * @property {string} email - Correo electrónico del usuario. Es obligatorio y debe tener un formato válido.
 * @property {string} password - Contraseña del usuario. Es obligatoria y debe cumplir con los siguientes criterios:
 *   - Mínimo 8 caracteres.
 *   - Al menos una letra mayúscula.
 *   - Al menos una letra minúscula.
 *   - Al menos un número.
 *   - Puede incluir los caracteres especiales: @ $ ! % * ? & #
 */
export const RegisterSchema = object({
  name: string({ required_error: "Name is required" }),
  email: string({ required_error: "Email is required" }).email({
    message: "Invalid email",
  }),
  password: string({ required_error: "Password is required" }).regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&#]{8,}$/,
      {
        message:
            "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number. Valid special characters: @ $ ! % * ? & #",
      }
  ),
});

/**
 * Esquema de validación para el inicio de sesión.
 *
 * @property {string} email - Correo electrónico del usuario. Es obligatorio.
 * @property {string} password - Contraseña del usuario. Es obligatoria.
 */
export const LoginSchema = object({
  email: string({ required_error: "Email is required" }),
  password: string({ required_error: "Password is required" }),
});

/**
 * Esquema de validación para restablecer la contraseña.
 *
 * @property {string} email - Correo electrónico del usuario. Es obligatorio y debe tener un formato válido.
 * @property {string} currentPassword - Contraseña actual del usuario. Es obligatoria.
 * @property {string} newPassword - Nueva contraseña del usuario. Es obligatoria y debe cumplir con los siguientes criterios:
 *   - Mínimo 8 caracteres.
 *   - Al menos una letra mayúscula.
 *   - Al menos una letra minúscula.
 *   - Al menos un número.
 */
export const ResetPasswordSchema = object({
  email: string({ required_error: "Email is required" }).email({
    message: "Invalid email",
  }),
  currentPassword: string({ required_error: "Password is required" }),
  newPassword: string({ required_error: "New password is required" }).regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      {
        message:
            "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number",
      }
  ),
});
