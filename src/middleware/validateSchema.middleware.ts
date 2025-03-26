import { ZodTypeAny } from "zod";

/**
 * Middleware para validar el cuerpo de la solicitud utilizando Zod.
 *
 * @template T - Tipo de esquema de Zod.
 * @param schema - Esquema de validación de Zod para la solicitud.
 * @returns Middleware de Express que valida `req.body.data`.
 */
export const validateSchema = <T extends ZodTypeAny>(schema: T) => {
  return async (req: any, res: any, next: any): Promise<void> => {
    try {
      await schema.parseAsync(req.body.data); // Valida el cuerpo de la solicitud
      next(); // Continúa con el siguiente middleware
    } catch (error) {
      res.status(400).json(error); // Responde con error de validación
    }
  };
};
