
import { organizationMapper } from "../../mappers/organization.mapper";
import { OrganizationDocument } from "../../models";
import { OrganizationPublic } from "../../types";

describe("OrganizationMapper", () => {
  const mockOrganization: OrganizationDocument = {
    id: "507f191e810c19729de860ea",
    name: "Test Organization",
    acronym: "TO",
  } as OrganizationDocument;

  it("debería mapear un OrganizationDocument a OrganizationPublic", () => {
    const result: OrganizationPublic =
      organizationMapper.DocumentToPublic(mockOrganization);

    expect(result).toEqual({
      id: mockOrganization.id,
      name: mockOrganization.name,
      acronym: mockOrganization.acronym,
    });
  });
});
