/**
 * Esquemas de validación para la creación y autenticación de usuarios.
 *
 * Estos esquemas utilizan `zod` para validar los datos de los usuarios en los procesos de registro e inicio de sesión.
 */

import { number, object, string } from "zod";

/**
 * Esquema de validación para la creación de un nuevo usuario.
 *
 * @property {string} name - Nombre del usuario. Es obligatorio.
 * @property {string} email - Correo electrónico del usuario. Es obligatorio y debe ser un email válido.
 * @property {string} password - Contraseña del usuario. Es obligatoria.
 * @property {number} age - Edad del usuario. Es obligatoria y debe estar entre 18 y 50 años.
 */
export const CreateUserSchema = object({
  name: string({ required_error: "Name is required" }),
  email: string({ required_error: "Email is required" }).email({
    message: "Invalid email",
  }),
  password: string({ required_error: "Password is required" }),
  age: number({ required_error: "Age is required" })
      .min(18, { message: "Age must be between 18 and 50" })
      .max(50, { message: "Age must be between 18 and 50" }),
});

/**
 * Esquema de validación para el inicio de sesión de un usuario.
 *
 * @property {string} email - Correo electrónico del usuario. Es obligatorio.
 * @property {string} password - Contraseña del usuario. Es obligatoria.
 */
export const LoginUserSchema = object({
  email: string({ required_error: "Email is required" }),
  password: string({ required_error: "Password is required" }),
});
