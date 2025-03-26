import mongoose, { Document, Schema } from "mongoose";
import { User } from "../types/user.types";

/**
 * Definición del documento de usuario que extiende la interfaz `User` y `Document` de Mongoose.
 * Incluye identificador único y marcas de tiempo.
 */
export type UserDocument = User &
    Document & {
    _id: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
};

/**
 * Esquema de Mongoose para la colección `users`, que representa a los usuarios en la base de datos.
 *
 * Campos:
 * - `name`: Nombre del usuario (requerido).
 * - `email`: Correo electrónico del usuario (requerido, único e indexado para búsquedas rápidas).
 * - `password`: Contraseña del usuario (requerido).
 * - `authorities`: Lista de roles o permisos asignados al usuario (requerido).
 *
 * Opciones:
 * - `timestamps`: Habilita `createdAt` y `updatedAt` automáticamente.
 * - `collection`: Define el nombre de la colección como `users`.
 */
const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, index: true, unique: true },
        password: { type: String, required: true },
        authorities: { type: [String], required: true },
    },
    {
        timestamps: true,
        collection: "users",
    }
);

/**
 * Modelo de usuario basado en el esquema `userSchema`.
 */
export const UserModel = mongoose.model<UserDocument>("User", userSchema);
