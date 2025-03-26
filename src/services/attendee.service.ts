import { AlreadyExistsError, NotFoundError } from "../exceptions";
import { userMapper } from "../mappers";
import { AttendeeModel, PostDocument, UserDocument } from "../models";
import { EventAttendee } from "../types/post.types";
import { postService } from "./post.service";
import { userService } from "./user.service";

/**
 * Service class to handle attendee-related operations.
 */
class AttendeeService {
  /**
   * Enrolls a user into an event.
   * @param enrollment - The enrollment details containing user ID, event ID, and remainders flag.
   * @throws {AlreadyExistsError} If the user is already enrolled in the event.
   * @returns The created enrollment document.
   */
  public async enroll(enrollment: EventAttendee) {
    // Validate that the user exists
    await userService.findUserById(enrollment.user);

    // Validate that the event exists and is attendable
    await postService.getAttendableById(enrollment.event);

    // Check if the user is already enrolled in the event
    if (await this.exists(enrollment.user, enrollment.event)) {
      throw new AlreadyExistsError(
        "The user is already enrolled into this event"
      );
    }

    // Create the enrollment
    return await AttendeeModel.create(enrollment);
  }

  /**
   * Retrieves all users enrolled in a specific event.
   * @param id - The ID of the event.
   * @throws {NotFoundError} If the event does not exist or is not attendable.
   * @returns An array of public user data for all attendees.
   */
  public async getEnrolledIn(id: string) {
    // Validate that the event exists and is attendable
    const post = await postService.getAttendableById(id);

    // Retrieve all attendees for the event
    const attendees = await AttendeeModel.find({ event: post.id }).populate<{
      user: UserDocument;
    }>("user");

    // Map attendees to public user data
    return attendees.map((value) => userMapper.DocumentToPublic(value.user));
  }

  /**
   * Checks if a user is already enrolled in a specific event.
   * @param userId - The ID of the user.
   * @param eventId - The ID of the event.
   * @returns True if the user is enrolled, false otherwise.
   */
  public async exists(userId: string, eventId: string) {
    return await AttendeeModel.exists({ user: userId, event: eventId }) != null;
  }

  /**
   * Retrieves the enrollment details for a specific user and event.
   * @param userId - The ID of the user.
   * @param eventId - The ID of the event.
   * @throws {NotFoundError} If no enrollment is found for the user and event.
   * @returns The enrollment document.
   */
  public async getById(userId: string, eventId: string) {
    const attendee = await AttendeeModel.findOne({
      user: userId,
      event: eventId,
    });

    if (!attendee) {
      throw new NotFoundError(
        `No attendee found for user ${userId} and event ${eventId}`
      );
    }

    return attendee;
  }

  /**
   * Cancels a user's enrollment in a specific event.
   * @param userId - The ID of the user.
   * @param eventId - The ID of the event.
   * @throws {NotFoundError} If no enrollment is found for the user and event.
   */
  public async cancelEnrollment(userId: string, eventId: string) {
    const enrollment = await AttendeeModel.findOneAndDelete({
      user: userId,
      event: eventId,
    });

    if (!enrollment) {
      throw new NotFoundError("Enrollment not found");
    }
  }

  /**
   * Retrieves all events a user is enrolled in.
   * @param userId - The ID of the user.
   * @returns An array of enrollment details, including event data and remainders flag.
   */
  public async getUserEnrollments(userId: string) {
    const enrollments = await AttendeeModel.find({ user: userId }).populate<{
      event: PostDocument;
    }>("event");

    return enrollments.map((enrollment) => ({
      event: enrollment.event,
      remainders: enrollment.remainders,
    }));
  }
}

export const attendeeService = new AttendeeService();