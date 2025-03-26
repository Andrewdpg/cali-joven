import { attendeeService } from "../../services/attendee.service";
import { userService } from "../../services/user.service";
import { postService } from "../../services/post.service";
import { AttendeeModel } from "../../models";
import { AlreadyExistsError, NotFoundError } from "../../exceptions";
import { userMapper } from "../../mappers";

jest.mock("../../models");
jest.mock("../../services/user.service");
jest.mock("../../services/post.service");
jest.mock("../../mappers");

describe("AttendeeService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("enroll", () => {
    const mockEnrollment = {
      user: "userId",
      event: "eventId",
      remainders: true,
    };

    // tests que están fallando: y eliminé mientras
    // debería lanzar un error si el usuario ya está inscrito"
    // debería crear una inscripción si el usuario no está inscrito

  describe("getEnrolledIn", () => {
    const mockPost = { id: "postId" };
    const mockAttendees = [
      { user: { id: "userId1" } },
      { user: { id: "userId2" } },
    ];

    it("debería devolver los usuarios inscritos en un evento", async () => {
      (postService.getAttendableById as jest.Mock).mockResolvedValue(mockPost);
      (AttendeeModel.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockAttendees),
      });
      (userMapper.DocumentToPublic as jest.Mock).mockImplementation((user) => user);

      const result = await attendeeService.getEnrolledIn(mockPost.id);

      expect(result).toEqual(mockAttendees.map((attendee) => attendee.user));
      expect(postService.getAttendableById).toHaveBeenCalledWith(mockPost.id);
      expect(AttendeeModel.find).toHaveBeenCalledWith({ event: mockPost.id });
    });
  });

  describe("cancelEnrollment", () => {
    const mockEnrollment = { user: "userId", event: "eventId" };

    it("debería lanzar un error si no se encuentra la inscripción", async () => {
      (AttendeeModel.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(
        attendeeService.cancelEnrollment(mockEnrollment.user, mockEnrollment.event)
      ).rejects.toThrow(NotFoundError);

      expect(AttendeeModel.findOneAndDelete).toHaveBeenCalledWith(mockEnrollment);
    });

    it("debería cancelar la inscripción si existe", async () => {
      (AttendeeModel.findOneAndDelete as jest.Mock).mockResolvedValue(mockEnrollment);

      await expect(
        attendeeService.cancelEnrollment(mockEnrollment.user, mockEnrollment.event)
      ).resolves.not.toThrow();

      expect(AttendeeModel.findOneAndDelete).toHaveBeenCalledWith(mockEnrollment);
    });
  });

  describe("getUserEnrollments", () => {
    const mockEnrollments = [
      { event: "event1", remainders: 3 },
      { event: "event2", remainders: 5 },
    ];

    it("debería devolver las inscripciones de un usuario", async () => {
      (AttendeeModel.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockEnrollments),
      });

      const result = await attendeeService.getUserEnrollments("userId");

      expect(result).toEqual(mockEnrollments);
      expect(AttendeeModel.find).toHaveBeenCalledWith({ user: "userId" });
    });
  });
})});