/**
 * Modelo de datos para representar publicaciones en la base de datos.
 * Una publicación puede ser un evento, una oferta o una noticia.
 * Contiene información como el título, descripción, adjuntos, imágenes,
 * usuario que la publicó, organización organizadora, ubicación, fechas relevantes y etiquetas.
 */
import mongoose, { Schema } from "mongoose";
import { Post } from "../types/post.types";

/**
 * Define la estructura del documento Post en MongoDB,
 * incluyendo propiedades adicionales como id y timestamps.
 */
export type PostDocument = Post &
    mongoose.Document & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
};

/**
 * Esquema de Mongoose para la colección de publicaciones (posts).
 * Incluye validaciones y referencias a otros modelos.
 */
const postSchema = new mongoose.Schema(
    {
        title: { type: String, required: true }, // Título de la publicación
        description: { type: String, required: true }, // Descripción del contenido
        type: { type: String, required: true, enum: ["event", "offer", "news"] }, // Tipo de publicación
        attachments: { type: String }, // URL o referencia a archivos adjuntos
        images: { type: [String], default: [] }, // Lista de URLs de imágenes asociadas
        published_by: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Usuario que publica
        organizer_id: { type: Schema.Types.ObjectId, ref: "Organization", required: true }, // Organización organizadora
        cities: { type: [String], required: true, default: [] }, // Ciudades donde aplica la publicación
        tags: { type: [String], required: true, default: [] }, // Etiquetas asociadas para clasificación

        date: { type: Date }, // Fecha del evento o noticia
        location: { type: String }, // Ubicación del evento
        registration_link: { type: String }, // Enlace para registro
        external_link: { type: String }, // Enlace a información externa
        deadline: { type: Date }, // Fecha límite para inscripciones o acciones
        author: { type: String }, // Autor de la publicación
    },
    {
        timestamps: true, // Agrega createdAt y updatedAt automáticamente
        collection: "posts", // Nombre de la colección en la base de datos
    }
);

/**
 * Modelo de Mongoose para la colección de publicaciones.
 */
export const PostModel = mongoose.model<PostDocument>("Post", postSchema);