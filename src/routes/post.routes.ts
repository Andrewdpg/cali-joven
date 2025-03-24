import { Router } from "express";
import { postController } from "../controllers";
import { auth } from "../middleware";

export const postRouter = Router();

postRouter.post("/", auth, postController.create);
postRouter.get("/", auth, postController.getAll);
postRouter.get("/:id", auth, postController.getById);
//postRouter.put("/:id", auth, postController.update);
postRouter.delete("/:id", auth, postController.delete);