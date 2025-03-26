import { Router } from "express";
import { organizationController } from "../controllers";
import { UserToOrganizationSchema, CreateOrganizationSchema } from "../schemas";
import { authorize, validateSchema } from "../middleware";

export const organizationRouter = Router();

// Crear una nueva organización
organizationRouter.post(
  "/",
  authorize(["admin"]),
  validateSchema(CreateOrganizationSchema),
  organizationController.create
);

// Actualizar una organización por ID
organizationRouter.put(
  "/:id",
  authorize(["admin"]),
  organizationController.updateById
);

// Eliminar una organización por ID
organizationRouter.delete(
  "/:id",
  authorize(["admin"]),
  organizationController.deleteById
);

// Obtener todas las organizaciones
organizationRouter.get("/", organizationController.findAll);

// Obtener una organización por ID
organizationRouter.get("/:id", organizationController.findById);

// Agregar un usuario a una organización
organizationRouter.post(
  "/:id/user/:userId",
  authorize(["admin"]),
  validateSchema(UserToOrganizationSchema),
  organizationController.addUserToOrganization
);

// Quitar un usuario de una organización
organizationRouter.delete(
  "/:id/user/:userId",
  authorize(["admin"]),
  organizationController.removeUserFromOrganization
);

// Actualizar el rol de un usuario en una organización
organizationRouter.put(
  "/:id/user/:userId",
  authorize(["admin"]),
  validateSchema(UserToOrganizationSchema),
  organizationController.updateUserRole
);
