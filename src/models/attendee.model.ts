import mongoose, { Schema } from "mongoose";
import { EventAttendee } from "../types/post.types";

/**
 * Definición del tipo de documento para asistentes a eventos.
 * Combina los datos del asistente con las propiedades de Mongoose Document.
 * Incluye marcas de tiempo y la posibilidad de gestionar eliminación lógica.
 */
export type AttendeeDocument = EventAttendee &
    mongoose.Document & {
    createdAt: Date; // Fecha de creación del registro
    updatedAt: Date; // Fecha de última actualización del registro
    deletedAt: Date; // Fecha de eliminación lógica (opcional, si se implementa)
};

/**
 * Esquema de Mongoose para almacenar asistentes a eventos.
 * Cada asistente está vinculado a un usuario y a un evento específico.
 */
const attendeeSchema = new mongoose.Schema(
    {
        /**
         * ID del usuario que se ha registrado en el evento.
         * Hace referencia al modelo `User`.
         */
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },

        /**
         * ID del evento al que el usuario se ha registrado.
         * Hace referencia al modelo `Post`, que representa eventos.
         */
        event: { type: Schema.Types.ObjectId, ref: "Post", required: true },

        /**
         * Indica si el usuario ha activado recordatorios para este evento.
         */
        remainders: { type: Boolean, required: true },
    },
    {
        timestamps: true, // Agrega automáticamente `createdAt` y `updatedAt` en cada documento
        collection: "attendees", // Define la colección en MongoDB para este modelo
    }
);

/**
 * Índice único para evitar registros duplicados.
 * Garantiza que un usuario no pueda registrarse más de una vez en el mismo evento.
 */
attendeeSchema.index({ user: 1, event: 1 }, { unique: true });

/**
 * Modelo de Mongoose para la colección `attendees`.
 * Permite realizar operaciones sobre los asistentes a eventos.
 */
export const AttendeeModel = mongoose.model<AttendeeDocument>(
    "Attendee",
    attendeeSchema
);
