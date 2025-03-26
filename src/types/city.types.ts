/**
 * Tipo `City`
 *
 * Representa una ciudad dentro del sistema.
 *
 * @property {string} name - Nombre de la ciudad.
 */
export type City = {
  name: string;
};

/**
 * Tipo `Commune`
 *
 * Representa una comuna o división administrativa dentro de una ciudad.
 *
 * @property {string} name - Nombre de la comuna.
 * @property {string} city_id - Identificador único de la ciudad a la que pertenece la comuna.
 * @property {string} organization_id - Identificador de la organización asociada a la comuna.
 * @property {string} president - Nombre del presidente o líder de la comuna.
 * @property {string} contact_info - Información de contacto del presidente o de la comuna.
 */
export type Commune = {
  name: string;
  city_id: string;
  organization_id: string;
  president: string;
  contact_info: string;
};
