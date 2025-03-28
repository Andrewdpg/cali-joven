import { Router } from "express";
import { authController } from "../controllers";
import { validateSchema } from "../middleware";
import { LoginSchema, RegisterSchema, ResetPasswordSchema } from "../schemas";

export const authRouter = Router();

authRouter.post(
  "/register",
  validateSchema(RegisterSchema),
  authController.register
);
authRouter.post(
  "/login",
  validateSchema(LoginSchema),
  authController.login
);
/**
 authRouter.post(
  "/reset-password",
  validateSchema(ResetPasswordSchema),
  authController.resetPassword
);

 */