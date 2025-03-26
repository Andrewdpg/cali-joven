/**
 * Tipo `PqrsType`
 *
 * Representa un tipo de Petición, Queja, Reclamo o Sugerencia (PQRS).
 *
 * @property {string} name - Nombre del tipo de PQRS.
 */
export type PqrsType = {
  name: string;
};

/**
 * Tipo `Pqrs`
 *
 * Representa una Petición, Queja, Reclamo o Sugerencia (PQRS) registrada en la plataforma.
 *
 * @property {string} title - Título de la PQRS.
 * @property {string} description - Descripción detallada de la PQRS.
 * @property {string} status - Estado actual de la PQRS (ejemplo: "pendiente", "en proceso", "resuelta").
 * @property {string} type - Tipo de PQRS, relacionado con `PqrsType`.
 * @property {string} attachment - Enlace a un archivo adjunto opcional relacionado con la PQRS.
 * @property {string} user - Identificador del usuario que creó la PQRS.
 */
export type Pqrs = {
  title: string;
  description: string;
  status: string;
  type: string;
  attachment: string;
  user: string;
};
