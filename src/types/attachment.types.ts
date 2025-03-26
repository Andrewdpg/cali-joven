/**
 * Tipo `Attachment`
 *
 * Representa un archivo adjunto en el sistema.
 *
 * @property {string} format - Formato del archivo adjunto (por ejemplo, "pdf", "jpg", "png").
 * @property {string} link - URL o enlace donde se encuentra almacenado el archivo adjunto.
 */
export type Attachment = {
  format: string;
  link: string;
};
