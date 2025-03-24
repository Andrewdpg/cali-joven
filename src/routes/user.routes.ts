import { Router } from "express";
import { userController } from "../controllers";
import { auth } from "../middleware";
import { authorize } from "../middleware/authorize.middleware";

export const userRouter = Router();

userRouter.get("/", auth, userController.getAllUsers);
userRouter.get("/:id", auth, userController.getUserById);
userRouter.put("/:id", auth, userController.updateUser);
userRouter.delete("/:id", auth, authorize(["admin"]), userController.deleteUser);