/**
 * Enumeración `HTTPCode`
 *
 * Define los códigos de estado HTTP utilizados en las respuestas del sistema.
 *
 * @enum {number}
 */
export enum HTTPCode {
  OK = 200, // Solicitud exitosa.
  CREATED = 201, // Recurso creado correctamente.
  BAD_REQUEST = 400, // Solicitud mal formada.
  UNAUTHORIZED = 401, // Usuario no autorizado.
  NOT_FOUND = 404, // Recurso no encontrado.
  INTERNAL_SERVER_ERROR = 500, // Error interno del servidor.
}

/**
 * Tipo `CommonResponse`
 *
 * Representa una respuesta común con un mensaje estructurado.
 *
 * ⚠️ **TODO:** Evaluar si este tipo es necesario o debe eliminarse.
 *
 * @property {object} message - Objeto que contiene el contenido del mensaje y el código HTTP.
 * @property {string} message.content - Mensaje de la respuesta.
 * @property {HTTPCode} message.code - Código de estado HTTP asociado.
 */
export type CommonResponse = {
  message: {
    content: string;
    code: HTTPCode;
  };
};

/**
 * Tipo `BasicResponse`
 *
 * Define una respuesta básica con información de éxito y un mensaje.
 *
 * @property {boolean} success - Indica si la operación fue exitosa.
 * @property {string} message - Mensaje descriptivo de la operación.
 */
export type BasicResponse = {
  success: boolean;
  message: string;
};

/**
 * Tipo `Metadata`
 *
 * Contiene metadatos comunes en las respuestas del sistema.
 *
 * @property {Date} timestamp - Marca de tiempo en que se generó la respuesta.
 * @property {string} version - Versión del sistema o API.
 */
export type Metadata = {
  timestamp: Date;
  version: string;
};

/**
 * Tipo `CreationResponse`
 *
 * Representa una respuesta para la creación de un recurso.
 *
 * @extends {BasicResponse}
 * @extends {Metadata}
 *
 * @property {object} data - Datos del recurso creado.
 * @property {Date} data.createdAt - Fecha de creación del recurso.
 * @property {any} data.resource - Recurso creado.
 */
export type CreationResponse = BasicResponse & {
  data: {
    createdAt: Date;
    resource: any;
  };
} & Metadata;

/**
 * Tipo `UpdateResponse`
 *
 * Representa una respuesta para la actualización de un recurso.
 *
 * @extends {BasicResponse}
 * @extends {Metadata}
 *
 * @property {object} data - Datos del recurso actualizado.
 * @property {Date} data.updatedAt - Fecha de la actualización.
 * @property {any} data.resource - Recurso actualizado.
 */
export type UpdateResponse = BasicResponse & {
  data: {
    updatedAt: Date;
    resource: any;
  };
} & Metadata;

/**
 * Tipo `DeleteResponse`
 *
 * Representa una respuesta para la eliminación de un recurso.
 *
 * @extends {BasicResponse}
 * @extends {Metadata}
 *
 * @property {object} data - Datos del recurso eliminado.
 * @property {Date} data.deletedAt - Fecha en que se eliminó el recurso.
 */
export type DeleteResponse = BasicResponse & {
  data: {
    deletedAt: Date;
  };
} & Metadata;

/**
 * Tipo `ErrorResponse`
 *
 * Representa una respuesta de error con detalles adicionales.
 *
 * @extends {BasicResponse}
 * @extends {Metadata}
 *
 * @property {object} error - Información del error.
 * @property {HTTPCode} error.code - Código de estado HTTP del error.
 * @property {string} error.details - Descripción del error.
 */
export type ErrorResponse = BasicResponse & {
  error: {
    code: HTTPCode;
    details: string;
  };
} & Metadata;

/**
 * Tipo `Pagination`
 *
 * Representa información de paginación para respuestas que contienen múltiples recursos.
 *
 * @property {number} page - Página actual.
 * @property {number} pageSize - Cantidad de elementos por página.
 * @property {number} totalPage - Total de páginas disponibles.
 * @property {number} totalItems - Total de elementos en la colección.
 */
export type Pagination = {
  page: number;
  pageSize: number;
  totalPage: number;
  totalItems: number;
};

/**
 * Tipo `GetResponse`
 *
 * Representa una respuesta para obtener recursos.
 *
 * @extends {BasicResponse}
 * @extends {Metadata}
 *
 * @property {object} data - Datos del recurso obtenido.
 * @property {any} data.resource - Recurso solicitado.
 * @property {Pagination} [data.pagination] - Información opcional de paginación.
 */
export type GetResponse = BasicResponse & {
  data: {
    resource: any;
    pagination?: Pagination;
  };
} & Metadata;
