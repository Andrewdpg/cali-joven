import mongoose from "mongoose";
import { OrganizationModel, OrganizationDocument, UserOrganizationModel } from "../models";
import { Organization } from "../types";
import {
  AlreadyExistsError,
  NotFoundError,
  ValidationError,
} from "../exceptions";

/**
 * Service class to handle organization-related operations.
 */
class OrganizationService {
  /**
   * Creates a new organization.
   * @param organization - The organization data to create.
   * @throws {AlreadyExistsError} If an organization with the same acronym already exists.
   * @returns The created organization document.
   */
  public async create(
    organization: Organization
  ): Promise<OrganizationDocument> {
    const organizationExists = await OrganizationModel.findOne({
      acronym: organization.acronym,
    });

    if (organizationExists) {
      throw new AlreadyExistsError(
        "An organization with that acronym already exists"
      );
    }

    return await OrganizationModel.create(organization);
  }

  /**
   * Retrieves an organization by its ID.
   * @param id - The ID of the organization.
   * @throws {ValidationError} If the provided ID is invalid.
   * @throws {NotFoundError} If no organization is found with the given ID.
   * @returns The organization document.
   */
  public async findById(id: string): Promise<OrganizationDocument> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid organization ID");
    }

    const organization = await OrganizationModel.findById(id);
    if (!organization) {
      throw new NotFoundError(`Organization with ID ${id} not found`);
    }

    return organization;
  }

  /**
   * Retrieves all organizations.
   * @returns A list of all organization documents.
   */
  public async findAll(): Promise<OrganizationDocument[]> {
    return await OrganizationModel.find();
  }

  /**
   * Updates an organization by its ID.
   * @param id - The ID of the organization.
   * @param data - The data to update.
   * @throws {ValidationError} If the provided ID is invalid.
   * @throws {NotFoundError} If no organization is found with the given ID.
   * @returns The updated organization document.
   */
  public async updateById(
    id: string,
    data: Partial<Organization>
  ): Promise<OrganizationDocument> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid organization ID");
    }

    const updatedOrganization = await OrganizationModel.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );

    if (!updatedOrganization) {
      throw new NotFoundError(`Organization with ID ${id} not found`);
    }

    return updatedOrganization;
  }

  /**
   * Deletes an organization by its ID.
   * @param id - The ID of the organization.
   * @throws {ValidationError} If the provided ID is invalid.
   * @throws {NotFoundError} If no organization is found with the given ID.
   */
  public async deleteById(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid organization ID");
    }

    const deleted = await OrganizationModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundError(`Organization with ID ${id} not found`);
    }
  }

  /**
   * Adds a user to an organization with a specific role.
   * @param userId - The ID of the user.
   * @param organizationId - The ID of the organization.
   * @param role - The role of the user in the organization.
   * @throws {AlreadyExistsError} If the user is already part of the organization.
   * @returns The created user-organization relationship document.
   */
  public async addUserToOrganization(userId: string, organizationId: string, role: string) {
    const exists = await UserOrganizationModel.findOne({ user: userId, organization: organizationId });
    if (exists) {
      throw new AlreadyExistsError("User is already part of the organization");
    }

    return await UserOrganizationModel.create({ user: userId, organization: organizationId, role });
  }

  /**
   * Removes a user from an organization.
   * @param userId - The ID of the user.
   * @param organizationId - The ID of the organization.
   * @throws {NotFoundError} If the user is not part of the organization.
   */
  public async removeUserFromOrganization(userId: string, organizationId: string) {
    const record = await UserOrganizationModel.findOneAndDelete({ user: userId, organization: organizationId });
    if (!record) {
      throw new NotFoundError("User is not part of the organization");
    }
  }

  /**
   * Updates the role of a user in an organization.
   * @param userId - The ID of the user.
   * @param organizationId - The ID of the organization.
   * @param role - The new role of the user in the organization.
   * @throws {NotFoundError} If the user is not part of the organization.
   * @returns The updated user-organization relationship document.
   */
  public async updateUserRole(userId: string, organizationId: string, role: string) {
    const record = await UserOrganizationModel.findOneAndUpdate(
      { user: userId, organization: organizationId },
      { role },
      { new: true }
    );
    if (!record) {
      throw new NotFoundError("User is not part of the organization");
    }
    return record;
  }
}

export const organizationService = new OrganizationService();