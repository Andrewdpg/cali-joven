import { Request, Response } from "express";
import { errorWrapper } from "../middleware";
import { attendeeService } from "../services/attendee.service";

class AttendeeController {
  public enroll = errorWrapper(async (req: Request, res: Response) => {
    const enrollement = await attendeeService.enroll({
      event: req.params.id,
      user: req.body.payload.user_id,
      remainders: req.body.remainders,
    });
    res.status(200).json(enrollement);
  });

  public getEnrolledIn = errorWrapper(async (req: Request, res: Response) => {
    const enrollement = await attendeeService.getEnrolledIn(req.params.id);
    res.status(200).json(enrollement);
  });

  public async cancelEnrollment(req: Request, res: Response) {
    const userId = req.body.payload.user_id;
    const eventId = req.params.id;

    await attendeeService.cancelEnrollment(userId, eventId);

    res.status(200).json({ message: "Enrollment canceled successfully" });
  }

  public async getMyEnrollments(req: Request, res: Response) {
    const userId = req.body.payload.user_id;

    const enrollments = await attendeeService.getUserEnrollments(userId);

    res.status(200).json(enrollments);
  }
}

export const attendeeController = new AttendeeController();
