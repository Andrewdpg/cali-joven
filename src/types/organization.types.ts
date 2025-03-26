/**
 * Tipo `Organization`
 *
 * Representa una organización dentro del sistema.
 *
 * @property {string} name - Nombre completo de la organización.
 * @property {string} acronym - Acrónimo o sigla de la organización.
 */
export type Organization = {
  name: string;
  acronym: string;
};

/**
 * Tipo `OrganizationPublic`
 *
 * Representa una organización con un identificador público.
 *
 * @property {string} id - Identificador único de la organización.
 * @property {string} name - Nombre completo de la organización.
 * @property {string} acronym - Acrónimo o sigla de la organización.
 */
export type OrganizationPublic = {
  id: string;
  name: string;
  acronym: string;
};

/**
 * Tipo `Commission`
 *
 * Representa una comisión dentro de una organización.
 *
 * @property {string} organization_id - ID de la organización a la que pertenece la comisión.
 * @property {string} name - Nombre de la comisión.
 * @property {string} leader - Identificador del usuario que lidera la comisión.
 * @property {string[]} members - Lista de identificadores de los miembros de la comisión.
 */
export type Commission = {
  organization_id: string;
  name: string;
  leader: string;
  members: string[];
};

/**
 * Tipo `UserOrganization`
 *
 * Relaciona un usuario con una organización y su rol dentro de la misma.
 *
 * @property {string} user - ID del usuario.
 * @property {string} organization - ID de la organización.
 * @property {string} role - Rol del usuario dentro de la organización.
 */
export type UserOrganization = {
  user: string;
  organization: string;
  role: string;
};
