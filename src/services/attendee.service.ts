import { AttendeeModel } from "../models";
import { EventAttendee } from "../types/post.types";
import { userService } from "./user.service";
import { postService } from "./post.service";
import { AlreadyExistsError, NotFoundError } from "../exceptions";

class AttendeeService {
  public async enroll(enrollment: EventAttendee) {
    await userService.findUserById(enrollment.user); // Validar que exista el usuario
    await postService.getById(enrollment.event); // Validar que exista el post

    if (await this.exists(enrollment.user, enrollment.event)){
      throw new AlreadyExistsError("The user is already enrolled into this event")
    }

    return await AttendeeModel.create(enrollment);
  }

  public async exists(userId: string, eventId: string) {
    return AttendeeModel.exists({ user: userId, event: eventId }) != null
  }

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
}

export const attendeeService = new AttendeeService();
