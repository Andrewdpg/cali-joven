/**
 * Módulo que define un mapeador para transformar documentos de organización en objetos públicos.
 *
 * Este mapeador convierte una entidad de organización almacenada en la base de datos
 * en un objeto con una estructura más simple y segura para su exposición pública.
 */

import { OrganizationDocument } from "../models";
import { OrganizationPublic } from "../types";

/**
 * Clase que implementa la conversión de un documento de organización a su representación pública.
 */
class OrganizationMapper {
  /**
   * Convierte un documento de organización en una estructura simplificada para su uso externo.
   *
   * @param {OrganizationDocument} organization - Documento de la organización obtenido de la base de datos.
   * @returns {OrganizationPublic} Representación pública de la organización con los campos esenciales.
   */
  public DocumentToPublic(organization: OrganizationDocument): OrganizationPublic {
    return {
      id: organization.id, // Identificador único de la organización.
      name: organization.name, // Nombre completo de la organización.
      acronym: organization.acronym, // Acrónimo o sigla de la organización.
    };
  }
}

/**
 * Instancia única del mapeador de organización para ser reutilizada en el sistema.
 */
export const organizationMapper = new OrganizationMapper();
