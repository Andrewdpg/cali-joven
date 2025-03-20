import { Router } from "express";
import { authController } from "../controllers";
import { validateSchema } from "../middleware";
import { RegisterSchema, LoginSchema, ResetPasswordSchema } from "../schemas";

export const authRouter = Router();

authRouter.post("/register", validateSchema(RegisterSchema), authController.CreateUser);
authRouter.post("/login", validateSchema(LoginSchema), authController.loginUser);
authRouter.post("/reset-password", validateSchema(ResetPasswordSchema), authController.resetPassword);
