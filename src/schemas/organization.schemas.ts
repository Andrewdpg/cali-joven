/**
 * Esquemas de validación para la creación de organizaciones y la asignación de usuarios a una organización.
 *
 * Estos esquemas utilizan `zod` para garantizar la validez de los datos antes de ser procesados.
 */

import { object, string } from "zod";

/**
 * Esquema de validación para la creación de una organización.
 *
 * @property {string} name - Nombre de la organización. Es obligatorio.
 * @property {string} acronym - Acrónimo de la organización. Es obligatorio.
 */
export const CreateOrganizationSchema = object({
  name: string({ required_error: "Name is required" }),
  acronym: string({ required_error: "Acronym is required" }),
});

/**
 * Esquema de validación para la asignación de un usuario a una organización.
 *
 * @property {string} role - Rol que el usuario desempeñará en la organización. Es obligatorio.
 */
export const UserToOrganizationSchema = object({
  role: string({ required_error: "Role is required" }),
});
