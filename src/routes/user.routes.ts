import { Router } from "express";
import { userController } from "../controllers";
import { authorize } from "../middleware";

export const userRouter = Router();

userRouter.get("/", authorize(["admin"]), userController.getAllUsers);
userRouter.get("/:id", authorize(["admin"]), userController.getUserById);
userRouter.put("/:id", authorize(["admin"]), userController.updateUser);
userRouter.delete("/:id", authorize(["admin"]), userController.deleteUser);