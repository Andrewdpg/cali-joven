import { Request, Response } from "express";
import {
  toCreationResponse,
  toDeleteResponse,
  toUpdateResponse,
} from "../mappers";
import { organizationMapper } from "../mappers/organization.mapper";
import { errorWrapper } from "../middleware";
import { organizationService } from "../services";
import { Organization } from "../types";

/**
 * Controller handling organization-related operations including:
 * creation, retrieval, updating, and deletion of organizations.
 */
class OrganizationController {
  /**
   * Creates a new organization.
   * @param {Request} req - Express request object containing organization data in req.body.data
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with the created organization data
   */
  public create = errorWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const organization: Organization = req.body.data;
      const newOrganization = await organizationService.create(organization);
      res
        .status(201)
        .json(
          toCreationResponse(
            organizationMapper.DocumentToPublic(newOrganization)
          )
        );
    }
  );

  /**
   * Retrieves an organization by ID.
   * @param {Request} req - Express request object with organization ID in req.params.id
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with the organization data
   */
  public findById = errorWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const organization = await organizationService.findById(id);
      res.status(200).json(organizationMapper.DocumentToPublic(organization));
    }
  );

  /**
   * Retrieves all organizations from the system.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with an array of all organizations
   */
  public findAll = errorWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const organizations = await organizationService.findAll();
      res
        .status(200)
        .json(
          organizations.map((org) => organizationMapper.DocumentToPublic(org))
        );
    }
  );

  /**
   * Updates an organization by ID.
   * @param {Request} req - Express request object with organization ID in req.params.id and update data in req.body.data
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with the updated organization data
   */
  public updateById = errorWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const data: Partial<Organization> = req.body.data;
      const updatedOrganization = await organizationService.updateById(
        id,
        data
      );
      res
        .status(200)
        .json(organizationMapper.DocumentToPublic(updatedOrganization));
    }
  );

  /**
   * Deletes an organization by ID.
   * @param {Request} req - Express request object with organization ID in req.params.id
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with a 204 status code on success
   */
  public deleteById = errorWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      await organizationService.deleteById(id);
      res.status(204).json(toDeleteResponse);
    }
  );

  /**
   * Adds a user to an organization with a specified role.
   * @param {Request} req - Express request object with user ID in req.params.userId, organization ID in req.params.id, and role in req.body.data.role
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with the updated organization-user data
   */
  public addUserToOrganization = errorWrapper(
    async (req: Request, res: Response) => {
      const { role } = req.body.data;
      const { id: organizationId, userId } = req.params;
      const result = await organizationService.addUserToOrganization(
        userId,
        organizationId,
        role
      );
      res.status(201).json(toCreationResponse(result));
    }
  );

  /**
   * Removes a user from an organization.
   * @param {Request} req - Express request object with user ID in req.params.userId and organization ID in req.params.id
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with a 204 status code on success
   */
  public removeUserFromOrganization = errorWrapper(
    async (req: Request, res: Response) => {
      const { id: organizationId, userId } = req.params;
      await organizationService.removeUserFromOrganization(
        userId,
        organizationId
      );
      res.status(204).json(toDeleteResponse);
    }
  );

  /**
   * Updates a user's role within an organization.
   * @param {Request} req - Express request object with user ID in req.params.userId, organization ID in req.params.id, and new role in req.body.data.role
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with the updated organization-user data
   */
  public updateUserRole = errorWrapper(async (req: Request, res: Response) => {
    const { id: organizationId, userId } = req.params;
    const { role } = req.body.data;
    const result = await organizationService.updateUserRole(
      userId,
      organizationId,
      role
    );
    res.status(200).json(toUpdateResponse(result));
  });
}

export const organizationController = new OrganizationController();
