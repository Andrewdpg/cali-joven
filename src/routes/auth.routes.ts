/**
 * Módulo de enrutamiento para la autenticación de usuarios.
 *
 * Define las rutas relacionadas con el registro, inicio de sesión y recuperación de contraseña.
 * Utiliza controladores para manejar la lógica de autenticación y middleware para validar datos.
 */

import { Router } from "express";
import { authController } from "../controllers";
import { validateSchema } from "../middleware";
import { LoginSchema, RegisterSchema, ResetPasswordSchema } from "../schemas";

/**
 * Router para gestionar la autenticación de usuarios.
 */
export const authRouter = Router();

/**
 * Ruta para registrar un nuevo usuario.
 *
 * @route POST /register
 * @middleware validateSchema(RegisterSchema) - Valida los datos de registro.
 * @controller authController.register - Controlador que maneja el registro.
 */
authRouter.post(
    "/register",
    validateSchema(RegisterSchema),
    authController.register
);

/**
 * Ruta para iniciar sesión.
 *
 * @route POST /login
 * @middleware validateSchema(LoginSchema) - Valida los datos de inicio de sesión.
 * @controller authController.login - Controlador que maneja la autenticación.
 */
authRouter.post(
    "/login",
    validateSchema(LoginSchema),
    authController.login
);

/**
 * Ruta para restablecer la contraseña (actualmente comentada).
 *
 * @route POST /reset-password
 * @middleware validateSchema(ResetPasswordSchema) - Valida los datos de recuperación.
 * @controller authController.resetPassword - Controlador que maneja el restablecimiento.
 */
/*
authRouter.post(
  "/reset-password",
  validateSchema(ResetPasswordSchema),
  authController.resetPassword
);
*/
