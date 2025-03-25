import { Request, Response } from "express";
import { organizationService } from "../services";
import { Organization } from "../types";
import { errorWrapper } from "../middleware";
import { toCreationResponse, toDeleteResponse } from "../mappers";
import { organizationMapper } from "../mappers/organization.mapper";

class OrganizationController {
  /**
   * Crear una nueva organización
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
   * Obtener una organización por ID
   */
  public findById = errorWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const organization = await organizationService.findById(id);
      res.status(200).json(organizationMapper.DocumentToPublic(organization));
    }
  );

  /**
   * Obtener todas las organizaciones
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
   * Actualizar una organización por ID
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
   * Eliminar una organización por ID
   */
  public deleteById = errorWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      await organizationService.deleteById(id);
      res.status(204).json(toDeleteResponse);
    }
  );
}

export const organizationController = new OrganizationController();
