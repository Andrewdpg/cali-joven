/**
 * Módulo que define un mapeador para transformar documentos de usuario en objetos públicos.
 *
 * Este mapeador convierte una entidad de usuario almacenada en la base de datos
 * en un objeto con una estructura más simple y segura para su exposición pública.
 */

import { UserDocument } from "../models";
import { UserPublic } from "../types";

/**
 * Clase que implementa la conversión de un documento de usuario a su representación pública.
 */
class UserMapper {
  /**
   * Convierte un documento de usuario en una estructura simplificada para su uso externo.
   *
   * @param {UserDocument} user - Documento del usuario obtenido de la base de datos.
   * @returns {UserPublic} Representación pública del usuario con los campos esenciales.
   */
  public DocumentToPublic(user: UserDocument): UserPublic {
    return {
      _id: user.id, // Identificador único del usuario.
      name: user.name, // Nombre completo del usuario.
      email: user.email, // Correo electrónico del usuario.
    };
  }
}

/**
 * Instancia única del mapeador de usuario para ser reutilizada en el sistema.
 */
export const userMapper = new UserMapper();
