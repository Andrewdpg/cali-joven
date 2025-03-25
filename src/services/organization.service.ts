import mongoose from "mongoose";
import { OrganizationModel, OrganizationDocument } from "../models";
import { Organization } from "../types";
import {
  AlreadyExistsError,
  NotFoundError,
  ValidationError,
} from "../exceptions";

class OrganizationService {
  /**
   * Crear una nueva organización
   * @param organization Datos de la organización
   * @returns Organización creada
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
   * Obtener una organización por su ID
   * @param id ID de la organización
   * @returns Organización encontrada o error si no existe
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
   * Obtener todas las organizaciones
   * @returns Lista de organizaciones
   */
  public async findAll(): Promise<OrganizationDocument[]> {
    return await OrganizationModel.find();
  }

  /**
   * Actualizar una organización por su ID
   * @param id ID de la organización
   * @param data Datos a actualizar
   * @returns Organización actualizada o error si no existe
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
   * Eliminar una organización por su ID
   * @param id ID de la organización
   * @returns void
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
}

export const organizationService = new OrganizationService();
