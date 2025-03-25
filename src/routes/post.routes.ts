import { Router } from "express";
import { attendeeController, postController } from "../controllers";
import { AttendeeSchema } from "../schemas/attendee.schemas";
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

postRouter.post("/:id/enroll", validateSchema(AttendeeSchema), attendeeController.enroll);
postRouter.get("/:id/enroll", authorize(["admin"]), attendeeController.getEnrolledIn);
postRouter.delete("/:id/enroll", attendeeController.cancelEnrollment);
postRouter.get("/my-enrollments", attendeeController.getMyEnrollments);