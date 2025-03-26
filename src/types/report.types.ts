/**
 * Tipo `Report`
 *
 * Representa un informe o reporte dentro del sistema.
 *
 * @property {string} document_id - Identificador único del documento relacionado con el informe.
 * @property {string} title - Título del informe.
 * @property {string} created_by - Identificador del usuario que creó el informe.
 */
export type Report = {
  document_id: string;
  title: string;
  created_by: string;
};

/**
 * Tipo `Document`
 *
 * Representa un documento almacenado dentro del sistema.
 *
 * @property {string} organization_id - Identificador de la organización propietaria del documento.
 * @property {string} type - Tipo de documento (ejemplo: "reporte", "reglamento", "acta").
 * @property {string} title - Título descriptivo del documento.
 * @property {string} file_url - URL de acceso al archivo del documento.
 */
export type Document = {
  organization_id: string;
  type: string;
  title: string;
  file_url: string;
};
