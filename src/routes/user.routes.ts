/**
 * Módulo de enrutamiento para la gestión de usuarios.
 *
 * Este módulo define las rutas para la consulta, actualización, eliminación de usuarios
 * y la gestión de roles. Requiere autorización con permisos de administrador.
 */

import { Router } from "express";
import { userController } from "../controllers";
import { authorize } from "../middleware";

/**
 * Router para la gestión de usuarios.
 */
export const userRouter = Router();

/**
 * Ruta para obtener todos los usuarios.
 *
 * @route GET /
 * @middleware authorize(["admin"]) - Requiere permisos de administrador.
 * @controller userController.getAllUsers - Controlador que maneja la consulta.
 */
userRouter.get("/", authorize(["admin"]), userController.getAllUsers);

/**
 * Ruta para obtener un usuario por su ID.
 *
 * @route GET /:id
 * @middleware authorize(["admin"]) - Requiere permisos de administrador.
 * @controller userController.getUserById - Controlador que maneja la consulta por ID.
 */
userRouter.get("/:id", authorize(["admin"]), userController.getUserById);

/**
 * Ruta para actualizar los datos de un usuario.
 *
 * @route PUT /:id
 * @middleware authorize(["admin"]) - Requiere permisos de administrador.
 * @controller userController.updateUser - Controlador que maneja la actualización.
 */
userRouter.put("/:id", authorize(["admin"]), userController.updateUser);

/**
 * Ruta para eliminar un usuario.
 *
 * @route DELETE /:id
 * @middleware authorize(["admin"]) - Requiere permisos de administrador.
 * @controller userController.deleteUser - Controlador que maneja la eliminación.
 */
userRouter.delete("/:id", authorize(["admin"]), userController.deleteUser);

/**
 * Ruta para agregar un rol a un usuario.
 *
 * @route POST /:id/role/:role
 * @middleware authorize(["admin"]) - Requiere permisos de administrador.
 * @controller userController.addRoleToUser - Controlador que maneja la asignación de roles.
 */
userRouter.post("/:id/role/:role", authorize(["admin"]), userController.addRoleToUser);

/**
 * Ruta para quitar un rol de un usuario.
 *
 * @route DELETE /:id/role/:role
 * @middleware authorize(["admin"]) - Requiere permisos de administrador.
 * @controller userController.removeRoleFromUser - Controlador que maneja la eliminación de roles.
 */
userRouter.delete("/:id/role/:role", authorize(["admin"]), userController.removeRoleFromUser);
