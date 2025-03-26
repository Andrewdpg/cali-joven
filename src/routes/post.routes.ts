import { Router } from "express";
import { attendeeController, postController } from "../controllers";
import { authorize, validateSchema } from "../middleware";
import { CreatePostSchema, UpdatePostSchema } from "../schemas";
import { AttendeeSchema } from "../schemas/attendee.schemas";

export const postRouter = Router();

postRouter.post(
  "/",
  authorize(["admin"]),
  validateSchema(CreatePostSchema),
  postController.create
);
postRouter.put(
  "/:id",
  authorize(["admin"]),
  validateSchema(UpdatePostSchema),
  postController.update
);
postRouter.delete("/:id", authorize(["admin"]), postController.delete);

postRouter.get("/", postController.getAll);
postRouter.get("/:id", postController.getById);

postRouter.post(
  "/:id/enroll",
  authorize(),
  validateSchema(AttendeeSchema),
  attendeeController.enroll
);
postRouter.get(
  "/:id/enroll",
  authorize(["admin"]),
  attendeeController.getEnrolledIn
);
postRouter.delete(
  "/:id/enroll",
  authorize(),
  attendeeController.cancelEnrollment
);
postRouter.get(
  "/enroll/my-enrollments",
  authorize(),
  attendeeController.getMyEnrollments
);
