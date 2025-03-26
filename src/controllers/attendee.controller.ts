import { Request, Response } from "express";
import { errorWrapper } from "../middleware";
import { attendeeService } from "../services/attendee.service";
import { toCreationResponse, toDeleteResponse } from "../mappers";

/**
 * Controller handling attendee-related operations including:
 * enrollment, retrieval, and cancellation of enrollments.
 */
class AttendeeController {
  /**
   * Enrolls a user in an event.
   * @param {Request} req - Express request object containing event ID and user ID
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with the created enrollment data
   */
  public enroll = errorWrapper(async (req: Request, res: Response) => {
    const enrollement = await attendeeService.enroll({
      event: req.params.id,
      user: req.body.payload.user_id,
      remainders: req.body.data.remainders,
    });
    res.status(200).json(toCreationResponse(enrollement));
  });

  /**
   * Retrieves all users enrolled in a specific event.
   * @param {Request} req - Express request object with event ID in params
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with an array of all enrolled users
   */
  public getEnrolledIn = errorWrapper(async (req: Request, res: Response) => {
    const enrollement = await attendeeService.getEnrolledIn(req.params.id);
    res.status(200).json(enrollement);
  });

  /**
   * Cancels a user's enrollment in an event.
   * @param {Request} req - Express request object with event ID
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with deletion confirmation
   */
  public cancelEnrollment = errorWrapper(async (req: Request, res: Response) => {
    const userId = req.body.payload.user_id;
    const eventId = req.params.id;

    await attendeeService.cancelEnrollment(userId, eventId);

    res.status(200).json(toDeleteResponse);
  })

  /**
   * Retrieves all events a user is enrolled in.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with an array of all enrolled events
   */
  public getMyEnrollments = errorWrapper(async(req: Request, res: Response) => {
    const userId = req.body.payload.user_id;

    const enrollments = await attendeeService.getUserEnrollments(userId);

    res.status(200).json(enrollments);
  })
}

export const attendeeController = new AttendeeController();
