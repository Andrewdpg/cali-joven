import { Router } from "express";
import { postController } from "../controllers";
import { auth, validateSchema } from "../middleware";
import { AttendeeSchema } from "../schemas/attendee.schemas";

export const postRouter = Router();

postRouter.post("/", auth, postController.create);
postRouter.get("/", auth, postController.getAll);
postRouter.get("/:id", auth, postController.getById);
//postRouter.put("/:id", auth, postController.update);
postRouter.delete("/:id", auth, postController.delete);
postRouter.post("/:id/enroll", auth, validateSchema(AttendeeSchema), postController.enroll);
