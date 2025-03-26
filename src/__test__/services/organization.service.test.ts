/**
 * Tests for the OrganizationService class.
 */
import mongoose from "mongoose";
import { organizationService } from "../../services/organization.service";
import { OrganizationModel, UserOrganizationModel } from "../../models";
import {
  AlreadyExistsError,
  NotFoundError,
  ValidationError,
} from "../../exceptions";

jest.mock("../../models");

describe("OrganizationService", () => {
  // Cleanup mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  /**
   * Tests for the create method.
   */
  describe("create", () => {
    const mockOrganization = {
      name: "Test Organization",
      acronym: "TO",
    };

    it("should create a new organization", async () => {
      (OrganizationModel.findOne as jest.Mock).mockResolvedValue(null);
      (OrganizationModel.create as jest.Mock).mockResolvedValue(
        mockOrganization
      );

      const result = await organizationService.create(mockOrganization);

      expect(result).toEqual(mockOrganization);
      expect(OrganizationModel.findOne).toHaveBeenCalledWith({
        acronym: mockOrganization.acronym,
      });
      expect(OrganizationModel.create).toHaveBeenCalledWith(mockOrganization);
    });

    it("should throw an error if the organization already exists", async () => {
      (OrganizationModel.findOne as jest.Mock).mockResolvedValue(
        mockOrganization
      );

      await expect(
        organizationService.create(mockOrganization)
      ).rejects.toThrow(AlreadyExistsError);

      expect(OrganizationModel.findOne).toHaveBeenCalledWith({
        acronym: mockOrganization.acronym,
      });
    });
  });

  /**
   * Tests for the findById method.
   */
  describe("findById", () => {
    const mockOrganization = {
      id: "validId",
      name: "Test Organization",
      acronym: "TO",
    };

    it("should return an organization by its ID", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
      (OrganizationModel.findById as jest.Mock).mockResolvedValue(
        mockOrganization
      );

      const result = await organizationService.findById(mockOrganization.id);

      expect(result).toEqual(mockOrganization);
      expect(OrganizationModel.findById).toHaveBeenCalledWith(
        mockOrganization.id
      );
    });

    it("should throw an error if the ID is invalid", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false);

      await expect(organizationService.findById("invalidId")).rejects.toThrow(
        ValidationError
      );
    });

    it("should throw an error if the organization does not exist", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
      (OrganizationModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(organizationService.findById("validId")).rejects.toThrow(
        NotFoundError
      );
    });
  });

  /**
   * Tests for the findAll method.
   */
  describe("findAll", () => {
    const mockOrganizations = [
      { id: "1", name: "Org 1", acronym: "O1" },
      { id: "2", name: "Org 2", acronym: "O2" },
    ];

    it("should return all organizations", async () => {
      (OrganizationModel.find as jest.Mock).mockResolvedValue(
        mockOrganizations
      );

      const result = await organizationService.findAll();

      expect(result).toEqual(mockOrganizations);
      expect(OrganizationModel.find).toHaveBeenCalled();
    });
  });

  /**
   * Tests for the updateById method.
   */
  describe("updateById", () => {
    const mockOrganization = {
      id: "validId",
      name: "Updated Organization",
      acronym: "UO",
    };

    it("should update an organization by its ID", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
      (OrganizationModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        mockOrganization
      );

      const result = await organizationService.updateById(mockOrganization.id, {
        name: "Updated Organization",
      });

      expect(result).toEqual(mockOrganization);
      expect(OrganizationModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockOrganization.id,
        { name: "Updated Organization" },
        { new: true }
      );
    });

    it("should throw an error if the ID is invalid", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false);

      await expect(
        organizationService.updateById("invalidId", {
          name: "Updated Organization",
        })
      ).rejects.toThrow(ValidationError);
    });

    it("should throw an error if the organization does not exist", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
      (OrganizationModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        null
      );

      await expect(
        organizationService.updateById("validId", {
          name: "Updated Organization",
        })
      ).rejects.toThrow(NotFoundError);
    });
  });

  /**
   * Tests for the deleteById method.
   */
  describe("deleteById", () => {
    it("should delete an organization by its ID", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
      (OrganizationModel.findByIdAndDelete as jest.Mock).mockResolvedValue({});

      await expect(
        organizationService.deleteById("validId")
      ).resolves.not.toThrow();

      expect(OrganizationModel.findByIdAndDelete).toHaveBeenCalledWith(
        "validId"
      );
    });

    it("should throw an error if the ID is invalid", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false);

      await expect(organizationService.deleteById("invalidId")).rejects.toThrow(
        ValidationError
      );
    });

    it("should throw an error if the organization does not exist", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
      (OrganizationModel.findByIdAndDelete as jest.Mock).mockResolvedValue(
        null
      );

      await expect(organizationService.deleteById("validId")).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("addUserToOrganization", () => {
    const mockUserId = "507f191e810c19729de860ea";
    const mockOrganizationId = "507f191e810c19729de860eb";
    const mockRole = "admin";

    it("debería agregar un usuario a una organización", async () => {
      (UserOrganizationModel.findOne as jest.Mock).mockResolvedValue(null);
      (UserOrganizationModel.create as jest.Mock).mockResolvedValue({
        user: mockUserId,
        organization: mockOrganizationId,
        role: mockRole,
      });

      const result = await organizationService.addUserToOrganization(
        mockUserId,
        mockOrganizationId,
        mockRole
      );

      expect(result).toEqual({
        user: mockUserId,
        organization: mockOrganizationId,
        role: mockRole,
      });
      expect(UserOrganizationModel.findOne).toHaveBeenCalledWith({
        user: mockUserId,
        organization: mockOrganizationId,
      });
      expect(UserOrganizationModel.create).toHaveBeenCalledWith({
        user: mockUserId,
        organization: mockOrganizationId,
        role: mockRole,
      });
    });

    it("debería lanzar un error si el usuario ya pertenece a la organización", async () => {
      (UserOrganizationModel.findOne as jest.Mock).mockResolvedValue({
        user: mockUserId,
        organization: mockOrganizationId,
        role: mockRole,
      });

      await expect(
        organizationService.addUserToOrganization(
          mockUserId,
          mockOrganizationId,
          mockRole
        )
      ).rejects.toThrow(AlreadyExistsError);

      expect(UserOrganizationModel.findOne).toHaveBeenCalledWith({
        user: mockUserId,
        organization: mockOrganizationId,
      });
      expect(UserOrganizationModel.create).not.toHaveBeenCalled();
    });
  });

  describe("removeUserFromOrganization", () => {
    const mockUserId = "507f191e810c19729de860ea";
    const mockOrganizationId = "507f191e810c19729de860eb";

    it("debería eliminar un usuario de una organización", async () => {
      (UserOrganizationModel.findOneAndDelete as jest.Mock).mockResolvedValue({
        user: mockUserId,
        organization: mockOrganizationId,
      });

      await expect(
        organizationService.removeUserFromOrganization(
          mockUserId,
          mockOrganizationId
        )
      ).resolves.not.toThrow();

      expect(UserOrganizationModel.findOneAndDelete).toHaveBeenCalledWith({
        user: mockUserId,
        organization: mockOrganizationId,
      });
    });

    it("debería lanzar un error si el usuario no pertenece a la organización", async () => {
      (UserOrganizationModel.findOneAndDelete as jest.Mock).mockResolvedValue(
        null
      );

      await expect(
        organizationService.removeUserFromOrganization(
          mockUserId,
          mockOrganizationId
        )
      ).rejects.toThrow(NotFoundError);

      expect(UserOrganizationModel.findOneAndDelete).toHaveBeenCalledWith({
        user: mockUserId,
        organization: mockOrganizationId,
      });
    });
  });

  describe("updateUserRole", () => {
    const mockUserId = "507f191e810c19729de860ea";
    const mockOrganizationId = "507f191e810c19729de860eb";
    const mockRole = "editor";

    it("debería actualizar el rol de un usuario en una organización", async () => {
      (UserOrganizationModel.findOneAndUpdate as jest.Mock).mockResolvedValue({
        user: mockUserId,
        organization: mockOrganizationId,
        role: mockRole,
      });

      const result = await organizationService.updateUserRole(
        mockUserId,
        mockOrganizationId,
        mockRole
      );

      expect(result).toEqual({
        user: mockUserId,
        organization: mockOrganizationId,
        role: mockRole,
      });
      expect(UserOrganizationModel.findOneAndUpdate).toHaveBeenCalledWith(
        { user: mockUserId, organization: mockOrganizationId },
        { role: mockRole },
        { new: true }
      );
    });

    it("debería lanzar un error si el usuario no pertenece a la organización", async () => {
      (UserOrganizationModel.findOneAndUpdate as jest.Mock).mockResolvedValue(
        null
      );

      await expect(
        organizationService.updateUserRole(
          mockUserId,
          mockOrganizationId,
          mockRole
        )
      ).rejects.toThrow(NotFoundError);

      expect(UserOrganizationModel.findOneAndUpdate).toHaveBeenCalledWith(
        { user: mockUserId, organization: mockOrganizationId },
        { role: mockRole },
        { new: true }
      );
    });
  });
});