import { AnyZodObject } from "zod";

export const validateSchema = (schema: AnyZodObject) => {
  return async (req: any, res: any, next: any): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      res.status(400).json(error);
    }
  };
};
