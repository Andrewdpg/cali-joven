/**
 * Tests for the UserService class.
 */
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { userService } from "../../services/user.service";
import { UserDocument, UserModel } from "../../models";
import { NotFoundError } from "../../exceptions";
import { mockDeep } from "jest-mock-extended";

jest.mock("../../models");
jest.mock("bcrypt");

describe("UserService", () => {
  // Cleanup mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  /**
   * Tests for the create method.
   */
  describe("create", () => {
    const mockUser = mockDeep<UserDocument>();
    mockUser.name = "Test User";
    mockUser.email = "test@example.com";
    mockUser.password = "password123";
    mockUser.authorities = ["USER"];
    mockUser.toObject.mockReturnValue({
      _id: new mongoose.Types.ObjectId(),
      __v: 0,
    });

    it("should create a new user", async () => {
      jest.spyOn(userService, "findUserByEmail").mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");
      (UserModel.create as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: "hashedpassword",
      });

      const result = await userService.create(mockUser);

      expect(result).toEqual({
        ...mockUser,
        password: "hashedpassword",
      });
      expect(userService.findUserByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(UserModel.create).toHaveBeenCalledWith({
        ...mockUser,
        password: "hashedpassword",
        authorities: [],
      });
    });

    it("should throw an error if the user already exists", async () => {
      jest.spyOn(userService, "findUserByEmail").mockResolvedValue(mockUser);

      await expect(userService.create(mockUser)).rejects.toThrow(
        "User with that email already exists"
      );

      expect(userService.findUserByEmail).toHaveBeenCalledWith(mockUser.email);
    });
  });

  /**
   * Tests for the findUserById method.
   */
  describe("findUserById", () => {
    const mockUser = {
      _id: "validId",
      name: "Test User",
      email: "test@example.com",
      authorities: ["USER"],
    };

    it("should return a user by ID", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.findUserById(mockUser._id);

      expect(result).toEqual({
        name: mockUser.name,
        email: mockUser.email,
      });
      expect(UserModel.findById).toHaveBeenCalledWith(mockUser._id);
    });

    it("should throw an error if the ID is invalid", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false);

      await expect(userService.findUserById("invalidId")).rejects.toThrow(
        "Invalid user ID"
      );
    });

    it("should throw an error if the user does not exist", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
      (UserModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(userService.findUserById("validId")).rejects.toThrow(
        NotFoundError
      );
    });
  });

  /**
   * Tests for the findUserByEmail method.
   */
  describe("findUserByEmail", () => {
    const mockUser = {
      name: "Test User",
      email: "test@example.com",
      authorities: ["USER"],
    };

    it("should return a user by email", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.findUserByEmail(mockUser.email);

      expect(result).toEqual(mockUser);
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });
    });

    it("should return null if the user does not exist", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      const result = await userService.findUserByEmail(
        "nonexistent@example.com"
      );

      expect(result).toBeNull();
    });
  });

  /**
   * Tests for the findAllUsers method.
   */
  describe("findAllUsers", () => {
    const mockUsers = [
      { name: "User 1", email: "user1@example.com", authorities: ["USER"] },
      { name: "User 2", email: "user2@example.com", authorities: ["USER"] },
    ];

    it("should return all users", async () => {
      (UserModel.find as jest.Mock).mockResolvedValue(mockUsers);

      const result = await userService.findAllUsers();

      expect(result).toEqual(mockUsers);
      expect(UserModel.find).toHaveBeenCalled();
    });
  });

  /**
   * Tests for the updateUserByEmail method.
   */
  describe("updateUserByEmail", () => {
    const mockUser = {
      _id: "507f191e810c19729de860ea",
      name: "Updated User",
      email: "test@example.com",
      authorities: ["USER"],
    };

    it("should update a user by email", async () => {
      const mockUpdatedUser = {
        ...mockUser,
        select: jest.fn().mockReturnValue(mockUser),
      };

      (UserModel.findByIdAndUpdate as jest.Mock).mockReturnValue(
        mockUpdatedUser
      );

      const result = await userService.updateUserById(mockUser._id, {
        name: "Updated User",
      });

      expect(result).toEqual(mockUser);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockUser._id, // Cambiado para usar el ID directamente
        { name: "Updated User" },
        { returnOriginal: false, new: true } // Asegúrate de incluir `new: true`
      );
      expect(mockUpdatedUser.select).toHaveBeenCalledWith("-password");
    });
  });

  /**
   * Tests for the deleteUserById method.
   */
  describe("deleteUserById", () => {
    const mockUser = {
      _id: "validId",
      name: "Test User",
      email: "test@example.com",
      authorities: ["USER"],
    };

    const authUser = {
      _id: "validId2",
      name: "Test User",
      email: "test@example2.com",
      authorities: ["USER"],
    };

    it("should delete a user by ID", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.deleteUserById(
        mockUser._id,
        authUser._id
      );

      expect(result).toEqual({
        name: mockUser.name,
        email: mockUser.email,
      });
      expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith(mockUser._id);
    });

    it("should throw an error if the ID is invalid", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false);

      await expect(
        userService.deleteUserById("invalidId", authUser._id)
      ).rejects.toThrow("Invalid user ID");
    });

    it("should return null if the user does not exist", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const result = await userService.deleteUserById("validId", authUser._id);

      expect(result).toBeNull();
    });
  });

  /**
   * Tests for the deleteUserByEmail method.
   */
  describe("deleteUserByEmail", () => {
    const mockUser = {
      name: "Test User",
      email: "test@example.com",
      authorities: ["USER"],
    };

    it("should delete a user by email", async () => {
      (UserModel.findOneAndDelete as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.deleteUserByEmail(mockUser.email);

      expect(result).toEqual(mockUser);
      expect(UserModel.findOneAndDelete).toHaveBeenCalledWith({
        email: mockUser.email,
      });
    });

    it("should return null if the user does not exist", async () => {
      (UserModel.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      const result = await userService.deleteUserByEmail(
        "nonexistent@example.com"
      );

      expect(result).toBeNull();
    });
  });

  /**
   * Tests for the userExists method.
   */
  describe("userExists", () => {
    it("should return true if the user exists", async () => {
      (UserModel.exists as jest.Mock).mockResolvedValue(true);

      const result = await userService.userExists("validId");

      expect(result).toBe(true);
      expect(UserModel.exists).toHaveBeenCalledWith({ id: "validId" });
    });

    it("should return false if the user does not exist", async () => {
      (UserModel.exists as jest.Mock).mockResolvedValue(null);

      const result = await userService.userExists("invalidId");

      expect(result).toBe(false);
      expect(UserModel.exists).toHaveBeenCalledWith({ id: "invalidId" });
    });
  });

  /**
   * Tests for the addRoleToUser and removeRoleFromUser methods.
   */
  describe("Roles management", () => {
    const mockUser = {
      _id: "validId",
      name: "Test User",
      email: "test@example.com",
      authorities: ["USER"],
      save: jest.fn(),
    };

    describe("addRoleToUser", () => {
      it("should add a role to a user", async () => {
        (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

        const result = await userService.addRoleToUser(mockUser._id, "ADMIN");

        expect(result.authorities).toContain("ADMIN");
        expect(mockUser.save).toHaveBeenCalled();
      });

      it("should throw an error if the user does not exist", async () => {
        (UserModel.findById as jest.Mock).mockResolvedValue(null);

        await expect(
          userService.addRoleToUser("invalidId", "ADMIN")
        ).rejects.toThrow("User not found");
      });

      it("should throw an error if the user already has the role", async () => {
        (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

        await expect(
          userService.addRoleToUser(mockUser._id, "USER")
        ).rejects.toThrow("User already has this role");
      });
    });

    describe("removeRoleFromUser", () => {
      it("should remove a role from a user", async () => {
        (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

        const result = await userService.removeRoleFromUser(
          mockUser._id,
          "USER"
        );

        expect(result.authorities).not.toContain("USER");
        expect(mockUser.save).toHaveBeenCalled();
      });

      it("should throw an error if the user does not exist", async () => {
        (UserModel.findById as jest.Mock).mockResolvedValue(null);

        await expect(
          userService.removeRoleFromUser("invalidId", "USER")
        ).rejects.toThrow("User not found");
      });

      it("should not fail if the user does not have the role", async () => {
        (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

        const result = await userService.removeRoleFromUser(
          mockUser._id,
          "NON_EXISTENT_ROLE"
        );

        expect(result.authorities).not.toContain("NON_EXISTENT_ROLE");
        expect(mockUser.save).toHaveBeenCalled();
      });
    });
  });
});
