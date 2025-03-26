/**
 * Tipo `UserBase`
 *
 * Representa la información básica de un usuario en el sistema.
 *
 * @property {string} name - Nombre del usuario.
 * @property {string} email - Dirección de correo electrónico del usuario.
 * @property {string} password - Contraseña del usuario.
 */
export type UserBase = {
  name: string;
  email: string;
  password: string;
};

/**
 * Tipo `UserAuth`
 *
 * Define los permisos y roles de un usuario dentro del sistema.
 *
 * @property {string[]} authorities - Lista de roles o permisos asignados al usuario.
 */
export type UserAuth = {
  authorities: string[];
};

/**
 * Tipo `User`
 *
 * Representa un usuario con su información básica y sus permisos dentro del sistema.
 *
 * Extiende `UserBase` y `UserAuth`.
 */
export type User = UserBase & UserAuth;

/**
 * Tipo `UserPublic`
 *
 * Representa la información pública de un usuario, omitiendo información sensible como la contraseña.
 *
 * @property {string} _id - Identificador único del usuario.
 * @property {string} name - Nombre del usuario.
 * @property {string} email - Dirección de correo electrónico del usuario.
 */
export type UserPublic = {
  _id: string;
  name: User["name"];
  email: User["email"];
};

/**
 * Tipo `UserUpdate`
 *
 * Define los campos que pueden ser actualizados en el perfil de un usuario.
 *
 * @property {string} [name] - Nuevo nombre del usuario (opcional).
 * @property {string} [email] - Nueva dirección de correo electrónico del usuario (opcional).
 * @property {string} [password] - Nueva contraseña del usuario (opcional).
 */
export type UserUpdate = {
  name?: string;
  email?: string;
  password?: string;
};

/**
 * Tipo `NotificationPreferences`
 *
 * Representa las preferencias de notificación de un usuario en la plataforma.
 *
 * @property {string} user - Identificador único del usuario.
 * @property {boolean} events - Indica si el usuario quiere recibir notificaciones sobre eventos.
 * @property {boolean} news - Indica si el usuario quiere recibir notificaciones sobre noticias.
 * @property {boolean} offers - Indica si el usuario quiere recibir notificaciones sobre ofertas.
 * @property {string[]} organizations - Lista de identificadores de organizaciones de interés.
 * @property {string[]} cities - Lista de identificadores de ciudades de interés.
 */
export type NotificationPreferences = {
  user: string;
  events: boolean;
  news: boolean;
  offers: boolean;
  organizations: string[];
  cities: string[];
};

/**
 * Tipo `Contact`
 *
 * Representa la información de contacto de un usuario.
 *
 * @property {string} email - Correo electrónico de contacto.
 * @property {string} phone - Número de teléfono del usuario.
 * @property {string[]} social_media_links - Lista de enlaces a redes sociales del usuario.
 */
export type Contact = {
  email: string;
  phone: string;
  social_media_links: string[];
};

/**
 * Tipo `UserSavedPost`
 *
 * Representa una publicación guardada por un usuario para su consulta posterior.
 *
 * @property {string} user_id - Identificador único del usuario que guardó la publicación.
 * @property {string} publication_id - Identificador único de la publicación guardada.
 * @property {Date} saved_at - Fecha y hora en que la publicación fue guardada.
 */
export type UserSavedPost = {
  user_id: string;
  publication_id: string;
  saved_at: Date;
};
