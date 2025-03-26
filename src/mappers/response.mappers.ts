/**
 * Módulo que define funciones para generar respuestas estructuradas en operaciones CRUD.
 *
 * Estas funciones generan respuestas estandarizadas para operaciones de creación, actualización,
 * eliminación y manejo de errores, garantizando consistencia en la API.
 */

import {
  CreationResponse,
  DeleteResponse,
  ErrorResponse,
  UpdateResponse,
} from "../types";

/**
 * Genera una respuesta estándar para la creación de un recurso.
 *
 * @param {any} resource - Recurso recién creado.
 * @param {string} [version="1.0.0"] - Versión de la API.
 * @returns {CreationResponse} Respuesta con detalles del recurso creado.
 */
export const toCreationResponse = (
    resource: any,
    version = "1.0.0"
): CreationResponse => {
  return {
    success: true,
    message: "Resource created",
    data: {
      createdAt: new Date(), // Fecha y hora de creación del recurso.
      resource,
    },
    timestamp: new Date(), // Marca de tiempo de la respuesta.
    version,
  };
};

/**
 * Genera una respuesta estándar para la actualización de un recurso.
 *
 * @param {any} resource - Recurso actualizado.
 * @param {string} [version="1.0.0"] - Versión de la API.
 * @returns {UpdateResponse} Respuesta con detalles del recurso actualizado.
 */
export const toUpdateResponse = (
    resource: any,
    version = "1.0.0"
): UpdateResponse => {
  return {
    success: true,
    message: "Resource updated",
    data: {
      updatedAt: new Date(), // Fecha y hora de actualización del recurso.
      resource,
    },
    timestamp: new Date(),
    version,
  };
};

/**
 * Genera una respuesta estándar para la eliminación de un recurso.
 *
 * @param {string} [version="1.0.0"] - Versión de la API.
 * @returns {DeleteResponse} Respuesta con detalles de la eliminación.
 */
export const toDeleteResponse = (version = "1.0.0"): DeleteResponse => {
  return {
    success: true,
    message: "Resource deleted",
    data: {
      deletedAt: new Date(), // Fecha y hora de eliminación del recurso.
    },
    timestamp: new Date(),
    version,
  };
};

/**
 * Genera una respuesta estándar para el manejo de errores.
 *
 * @param {number} code - Código de error HTTP.
 * @param {string} details - Descripción detallada del error.
 * @param {string} [version="1.0.0"] - Versión de la API.
 * @returns {ErrorResponse} Respuesta con detalles del error.
 */
export const toErrorResponse = (
    code: number,
    details: string,
    version = "1.0.0"
): ErrorResponse => {
  return {
    success: false,
    message: "Error",
    error: {
      code, // Código de estado del error.
      details, // Descripción del error.
    },
    timestamp: new Date(),
    version,
  };
};
