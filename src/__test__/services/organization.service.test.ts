/**
 * Tests for the OrganizationService class.
 */
import mongoose from "mongoose";
import { organizationService } from "../../services/organization.service";
import { OrganizationModel } from "../../models";
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
});