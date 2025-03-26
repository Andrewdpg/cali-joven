import { attendeeService } from "../../services/attendee.service";
import { userService } from "../../services/user.service";
import { postService } from "../../services/post.service";
import { AttendeeModel, PostDocument } from "../../models";
import { AlreadyExistsError, NotFoundError } from "../../exceptions";
import { userMapper } from "../../mappers";
import { mockDeep } from "jest-mock-extended";

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
        (postService.getAttendableById as jest.Mock).mockResolvedValue(
          mockPost
        );
        (AttendeeModel.find as jest.Mock).mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockAttendees),
        });
        (userMapper.DocumentToPublic as jest.Mock).mockImplementation(
          (user) => user
        );

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
          attendeeService.cancelEnrollment(
            mockEnrollment.user,
            mockEnrollment.event
          )
        ).rejects.toThrow(NotFoundError);

        expect(AttendeeModel.findOneAndDelete).toHaveBeenCalledWith(
          mockEnrollment
        );
      });

      it("debería cancelar la inscripción si existe", async () => {
        (AttendeeModel.findOneAndDelete as jest.Mock).mockResolvedValue(
          mockEnrollment
        );

        await expect(
          attendeeService.cancelEnrollment(
            mockEnrollment.user,
            mockEnrollment.event
          )
        ).resolves.not.toThrow();

        expect(AttendeeModel.findOneAndDelete).toHaveBeenCalledWith(
          mockEnrollment
        );
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

    describe("enroll", () => {
      const mockEnrollment = {
        user: "userId",
        event: "eventId",
        remainders: true,
      };

      it("debería lanzar un error si el usuario ya está inscrito", async () => {
        jest.spyOn(userService, "findUserById").mockResolvedValue({
          _id: "507f191e810c19729de860ea",
          name: "Hola",
          email: "hola@example.com",
        });
        jest.spyOn(postService, "getAttendableById").mockResolvedValue(mockDeep<PostDocument>());
        jest.spyOn(attendeeService, "exists").mockResolvedValue(true);

        await expect(attendeeService.enroll(mockEnrollment)).rejects.toThrow(
          AlreadyExistsError
        );

        expect(userService.findUserById).toHaveBeenCalledWith(
          mockEnrollment.user
        );
        expect(postService.getAttendableById).toHaveBeenCalledWith(
          mockEnrollment.event
        );
        expect(attendeeService.exists).toHaveBeenCalledWith(
          mockEnrollment.user,
          mockEnrollment.event
        );
        expect(AttendeeModel.create).not.toHaveBeenCalled();
      });

      it("debería crear una inscripción si el usuario no está inscrito", async () => {
        jest.spyOn(userService, "findUserById").mockResolvedValue({
          _id: "507f191e810c19729de860ea",
          name: "Hola",
          email: "hola@example.com",
        });
        jest
          .spyOn(postService, "getAttendableById")
          .mockResolvedValue(mockDeep<PostDocument>());
        jest.spyOn(attendeeService, "exists").mockResolvedValue(false);
        (AttendeeModel.create as jest.Mock).mockResolvedValue(mockEnrollment);

        const result = await attendeeService.enroll(mockEnrollment);

        expect(result).toEqual(mockEnrollment);
        expect(userService.findUserById).toHaveBeenCalledWith(
          mockEnrollment.user
        );
        expect(postService.getAttendableById).toHaveBeenCalledWith(
          mockEnrollment.event
        );
        expect(attendeeService.exists).toHaveBeenCalledWith(
          mockEnrollment.user,
          mockEnrollment.event
        );
        expect(AttendeeModel.create).toHaveBeenCalledWith(mockEnrollment);
      });
    });
  });
});
