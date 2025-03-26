/**
 * Módulo de enrutamiento para la gestión de publicaciones y asistencia a eventos.
 *
 * Este módulo define las rutas para la creación, actualización, eliminación y consulta de publicaciones,
 * así como la inscripción y cancelación de asistencia a eventos.
 * Se utilizan middleware para autorización y validación de datos.
 */

import { Router } from "express";
import { attendeeController, postController } from "../controllers";
import { authorize, validateSchema } from "../middleware";
import { CreatePostSchema, UpdatePostSchema } from "../schemas";
import { AttendeeSchema } from "../schemas/attendee.schemas";

/**
 * Router para la gestión de publicaciones y asistencia.
 */
export const postRouter = Router();

/**
 * Ruta para crear una nueva publicación.
 *
 * @route POST /
 * @middleware authorize(["admin"]) - Requiere permisos de administrador.
 * @middleware validateSchema(CreatePostSchema) - Valida los datos de la publicación.
 * @controller postController.create - Controlador que maneja la creación.
 */
postRouter.post(
    "/",
    authorize(["admin"]),
    validateSchema(CreatePostSchema),
    postController.create
);

/**
 * Ruta para actualizar una publicación existente.
 *
 * @route PUT /:id
 * @middleware authorize(["admin"]) - Requiere permisos de administrador.
 * @middleware validateSchema(UpdatePostSchema) - Valida los datos actualizados.
 * @controller postController.update - Controlador que maneja la actualización.
 */
postRouter.put(
    "/:id",
    authorize(["admin"]),
    validateSchema(UpdatePostSchema),
    postController.update
);

/**
 * Ruta para eliminar una publicación.
 *
 * @route DELETE /:id
 * @middleware authorize(["admin"]) - Requiere permisos de administrador.
 * @controller postController.delete - Controlador que maneja la eliminación.
 */
postRouter.delete("/:id", authorize(["admin"]), postController.delete);

/**
 * Ruta para obtener todas las publicaciones.
 *
 * @route GET /
 * @controller postController.getAll - Controlador que maneja la consulta de todas las publicaciones.
 */
postRouter.get("/", postController.getAll);

/**
 * Ruta para obtener una publicación por su ID.
 *
 * @route GET /:id
 * @controller postController.getById - Controlador que maneja la consulta por ID.
 */
postRouter.get("/:id", postController.getById);

/**
 * Ruta para inscribirse a un evento asociado a una publicación.
 *
 * @route POST /:id/enroll
 * @middleware authorize() - Requiere autenticación.
 * @middleware validateSchema(AttendeeSchema) - Valida los datos de inscripción.
 * @controller attendeeController.enroll - Controlador que maneja la inscripción.
 */
postRouter.post(
    "/:id/enroll",
    authorize(),
    validateSchema(AttendeeSchema),
    attendeeController.enroll
);

/**
 * Ruta para obtener la lista de inscritos en un evento.
 *
 * @route GET /:id/enroll
 * @middleware authorize(["admin"]) - Requiere permisos de administrador.
 * @controller attendeeController.getEnrolledIn - Controlador que maneja la consulta de inscritos.
 */
postRouter.get(
    "/:id/enroll",
    authorize(["admin"]),
    attendeeController.getEnrolledIn
);

/**
 * Ruta para cancelar la inscripción a un evento.
 *
 * @route DELETE /:id/enroll
 * @middleware authorize() - Requiere autenticación.
 * @controller attendeeController.cancelEnrollment - Controlador que maneja la cancelación de inscripción.
 */
postRouter.delete(
    "/:id/enroll",
    authorize(),
    attendeeController.cancelEnrollment
);

/**
 * Ruta para obtener las inscripciones del usuario autenticado.
 *
 * @route GET /enroll/my-enrollments
 * @middleware authorize() - Requiere autenticación.
 * @controller attendeeController.getMyEnrollments - Controlador que maneja la consulta de inscripciones del usuario.
 */
postRouter.get(
    "/enroll/my-enrollments",
    authorize(),
    attendeeController.getMyEnrollments
);
