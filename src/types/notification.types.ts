/**
 * Tipo `Notification`
 *
 * Representa una notificación enviada a un usuario en el sistema.
 *
 * @property {string} user_id - Identificador único del usuario que recibe la notificación.
 * @property {string} message - Contenido de la notificación.
 * @property {string} type - Tipo de notificación (ejemplo: "info", "warning", "error").
 * @property {boolean} is_read - Indica si la notificación ha sido leída (`true`) o no (`false`).
 * @property {Date} sent_at - Fecha y hora en que se envió la notificación.
 */
export type Notification = {
  user_id: string;
  message: string;
  type: string;
  is_read: boolean;
  sent_at: Date;
};
