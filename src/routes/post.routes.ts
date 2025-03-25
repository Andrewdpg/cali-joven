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
postRouter.put("/:id", authorize(["admin"]), postController.update);
postRouter.delete("/:id", authorize(["admin"]), postController.delete);

postRouter.get("/", postController.getAll);
postRouter.get("/:id", postController.getById);
