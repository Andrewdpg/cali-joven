import { Router } from "express";
import { organizationController } from "../controllers";
import { CreateOrganizationSchema } from "../schemas";
import { authorize, validateSchema } from "../middleware";

export const organizationRouter = Router();

// Crear una nueva organización
organizationRouter.post(
  "/",
  authorize(["admin"]),
  validateSchema(CreateOrganizationSchema),
  organizationController.create
);

// Obtener todas las organizaciones
organizationRouter.get(
  "/",
  organizationController.findAll
);

// Obtener una organización por ID
organizationRouter.get(
  "/:id",
  organizationController.findById
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