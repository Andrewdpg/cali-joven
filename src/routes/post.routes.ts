import { Router } from "express";
import { attendeeController, postController } from "../controllers";
import { auth, authorize, validateSchema } from "../middleware";
import { AttendeeSchema } from "../schemas/attendee.schemas";

export const postRouter = Router();

postRouter.post("/", auth, postController.create);
postRouter.get("/", auth, postController.getAll);
postRouter.get("/:id", auth, postController.getById);
//postRouter.put("/:id", auth, postController.update);
postRouter.delete("/:id", auth, postController.delete);

postRouter.post("/:id/enroll", auth, validateSchema(AttendeeSchema), attendeeController.enroll);
postRouter.get("/:id/enroll", auth, authorize(["admin"]), attendeeController.getEnrolledIn);
postRouter.delete("/:id/enroll", auth, attendeeController.cancelEnrollment);
postRouter.get("/my-enrollments", auth, attendeeController.getMyEnrollments);
