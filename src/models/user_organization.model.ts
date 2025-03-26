/**
 * Modelo de datos para la relación entre usuarios y organizaciones.
 *
 * Este modelo representa la asociación entre un usuario y una organización,
 * permitiendo gestionar a qué organización pertenece cada usuario dentro del sistema.
 */

import mongoose, { Schema } from "mongoose";
import { UserOrganization } from "../types";

/**
 * Definición del tipo para documentos de UserOrganization.
 * Extiende `mongoose.Document` para incluir las propiedades específicas de la relación.
 */
export type UserOrganizationDocument = UserOrganization & mongoose.Document;

/**
 * Esquema de la relación entre usuarios y organizaciones.
 * Cada registro asocia un usuario con una organización específica.
 */
const userOrganizationSchema = new Schema(
    {
        /** Identificador del usuario asociado a la organización */
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        /** Identificador de la organización a la que pertenece el usuario */
        organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true }
    },
    {
        timestamps: true, // Agrega automáticamente createdAt y updatedAt
        collection: "user_organizations", // Define el nombre de la colección en MongoDB
    }
);

/**
 * Índice único que evita la duplicación de asociaciones usuario-organización.
 * Garantiza que un usuario no pueda estar en la misma organización más de una vez.
 */
userOrganizationSchema.index({ user: 1, organization: 1 }, { unique: true });

/**
 * Modelo de Mongoose para la colección "user_organizations".
 */
export const UserOrganizationModel = mongoose.model<UserOrganizationDocument>(
    "UserOrganization",
    userOrganizationSchema
);
