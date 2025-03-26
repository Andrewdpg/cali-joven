/**
 * Tipo `SocialMediaLink`
 *
 * Representa un enlace a una red social asociado a un usuario, organización u otra entidad.
 *
 * @property {string} link - URL del perfil o página en la red social.
 * @property {string} social_media - Nombre de la red social (ejemplo: "Facebook", "Twitter", "Instagram").
 */
export type SocialMediaLink = {
  link: string;
  social_media: string;
};

/**
 * Tipo `SocialMedia`
 *
 * Representa una red social dentro del sistema.
 *
 * @property {string} name - Nombre de la red social (ejemplo: "Facebook", "Twitter").
 * @property {string} icon_id - Identificador del icono asociado a la red social.
 */
export type SocialMedia = {
  name: string;
  icon_id: string;
};
