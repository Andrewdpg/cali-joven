import { AttendeeModel, PostDocument, UserDocument } from "../models";
import { EventAttendee } from "../types/post.types";
import { userService } from "./user.service";
import { postService } from "./post.service";
import { AlreadyExistsError, NotFoundError } from "../exceptions";
import { userMapper } from "../mappers";

class AttendeeService {
  public async enroll(enrollment: EventAttendee) {
    await userService.findUserById(enrollment.user); // Validar que exista el usuario
    await postService.getAttendableById(enrollment.event); // Validar que exista el post

    if (await this.exists(enrollment.user, enrollment.event)) {
      throw new AlreadyExistsError(
        "The user is already enrolled into this event"
      );
    }

    return await AttendeeModel.create(enrollment);
  }

  public async getEnrolledIn(id: string) {
    const post = await postService.getAttendableById(id);

    //Obtener todos los registros de enroll
    const attendees = await AttendeeModel.find({ event: post.id }).populate<{
      user: UserDocument;
    }>("user");

    // Mapear los usuarios
    return attendees.map((value) => userMapper.DocumentToPublic(value.user));
  }

  public async exists(userId: string, eventId: string) {
    return AttendeeModel.exists({ user: userId, event: eventId }) != null;
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

  public async cancelEnrollment(userId: string, eventId: string) {
    const enrollment = await AttendeeModel.findOneAndDelete({
      user: userId,
      event: eventId,
    });

    if (!enrollment) {
      throw new NotFoundError("Enrollment not found");
    }
  }

  public async getUserEnrollments(userId: string) {
    const enrollments = await AttendeeModel.find({ user: userId }).populate<{event: PostDocument}>("event");

    return enrollments.map((enrollment) => ({
      event: enrollment.event,
      remainders: enrollment.remainders,
    }));
  }
}

export const attendeeService = new AttendeeService();
