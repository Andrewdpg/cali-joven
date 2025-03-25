import { Router } from "express";
import { userController } from "../controllers";
import { authorize } from "../middleware";

export const userRouter = Router();

userRouter.get("/", userController.getAllUsers);
userRouter.get("/:id", userController.getUserById);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", authorize(["admin"]), userController.deleteUser);