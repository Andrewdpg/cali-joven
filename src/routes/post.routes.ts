import { Router } from "express";
import { postController } from "../controllers";
import { authorize, validateSchema } from "../middleware";
import { CreatePostSchema } from "../schemas";

export const postRouter = Router();

postRouter.post(
  "/",
  authorize(["admin"]), 
  validateSchema(CreatePostSchema),
  postController.create
);  
postRouter.get("/", postController.getAll);
postRouter.get("/:id", postController.getById);
//postRouter.put("/:id", auth, postController.update);
//postRouter.delete("/:id", auth, postController.delete);
