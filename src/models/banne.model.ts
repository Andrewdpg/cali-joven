import mongoose from "mongoose";

/**
 * Definición del tipo de documento para los banners.
 * Representa un banner publicitario con un título, una imagen y un enlace.
 * Incluye marcas de tiempo y la posibilidad de gestionar eliminación lógica.
 */
export type BannerDocument = mongoose.Document & {
    title: string; // Título del banner
    image_url: string; // URL de la imagen del banner
    link: string; // Enlace al que dirige el banner
    createdAt: Date; // Fecha de creación del registro
    updatedAt: Date; // Fecha de última actualización del registro
    deletedAt: Date; // Fecha de eliminación lógica (opcional, si se implementa)
};

/**
 * Esquema de Mongoose para la colección de banners.
 * Cada banner contiene un título, una imagen y un enlace asociado.
 */
const bannerSchema = new mongoose.Schema(
    {
        /**
         * Título del banner.
         * Campo requerido.
         */
        title: { type: String, required: true },

        /**
         * URL de la imagen del banner.
         * Campo requerido.
         */
        image_url: { type: String, required: true },

        /**
         * Enlace al que redirige el banner.
         * Campo requerido.
         */
        link: { type: String, required: true },
    },
    {
        timestamps: true, // Agrega automáticamente `createdAt` y `updatedAt` en cada documento
        collection: "banners", // Define la colección en MongoDB para este modelo
    }
);

/**
 * Modelo de Mongoose para la colección `banners`.
 * Permite realizar operaciones sobre los banners almacenados.
 */
export const BannerModel = mongoose.model<BannerDocument>("Banner", bannerSchema);
