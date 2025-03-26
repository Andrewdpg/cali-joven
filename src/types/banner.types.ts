/**
 * Tipo `BannerBase`
 *
 * Representa la estructura básica de un banner publicitario o informativo en la aplicación.
 *
 * @property {string} title - Título o encabezado del banner.
 * @property {string} image_url - URL de la imagen asociada al banner.
 * @property {string} link - Enlace al que redirige el banner al hacer clic.
 */
export type BannerBase = {
  title: string;
  image_url: string;
  link: string;
};
