export type Organization = {
  name: string;
  acronym: string;
};

export type OrganizationPublic = {
  id: string;
  name: string;
  acronym: string;
};

export type Commission = {
  organization_id: string;
  name: string;
  leader: string;
  members: string[];
};

// Relaciones con otras entidades
export type UserOrganization = {
  user: string; // ID del usuario
  organization: string; // ID de la organización
  role: string; // Rol del usuario en la organización
}