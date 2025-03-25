import { OrganizationDocument } from "../models";
import { OrganizationPublic } from "../types";

class OrganizationMapper {
  public DocumentToPublic(organization: OrganizationDocument): OrganizationPublic {
    return {
      id: organization.id,
      name: organization.name,
      acronym: organization.acronym,
    };
  }
}

export const organizationMapper = new OrganizationMapper();