import mongoose, { Schema } from "mongoose";
import { Organization } from "../types";

/**
 * Definición del tipo de documento para las organizaciones.
 * Hereda las propiedades de `Organization` y las extiende con las capacidades de Mongoose.
 */
export type OrganizationDocument = Organization & mongoose.Document;

/**
 * Esquema de Mongoose para la colección de organizaciones.
 * Representa una entidad organizativa con un nombre y un acrónimo único.
 */
const organizationSchema = new Schema(
    {
        /**
         * Nombre completo de la organización.
         * Campo obligatorio.
         */
        name: { type: String, required: true },

        /**
         * Acrónimo de la organización (Ej. "PDJ", "CDJ").
         * Campo obligatorio y único para evitar duplicados.
         */
        acronym: { type: String, required: true, unique: true },
    },
    {
        timestamps: true, // Agrega automáticamente `createdAt` y `updatedAt` en cada documento
        collection: "organizations", // Define la colección en MongoDB
    }
);

/**
 * Modelo de Mongoose para la colección `organizations`.
 * Permite realizar operaciones CRUD sobre las organizaciones almacenadas.
 */
export const OrganizationModel = mongoose.model<OrganizationDocument>(
    "Organization",
    organizationSchema
);