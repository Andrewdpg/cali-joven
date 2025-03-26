/**
 * Esquemas de validación para la creación y actualización de publicaciones (posts).
 *
 * Estos esquemas utilizan `zod` para validar los datos relacionados con eventos, ofertas y noticias.
 */

import { object, string, z } from "zod";

/**
 * Esquema base para todas las publicaciones.
 *
 * @property {string} title - Título de la publicación. Es obligatorio.
 * @property {string} description - Descripción de la publicación. Es obligatoria.
 * @property {"event" | "offer" | "news"} type - Tipo de publicación. Puede ser "event", "offer" o "news". Es obligatorio.
 * @property {string} [attachments] - Opcional. URL o referencia a archivos adjuntos.
 * @property {string[]} [images] - Opcional. Lista de URLs de imágenes asociadas con la publicación.
 * @property {string} organizer_id - ID del organizador de la publicación. Es obligatorio.
 * @property {string[]} cities - Lista de ciudades asociadas con la publicación. Es obligatoria.
 * @property {string[]} tags - Lista de etiquetas asociadas con la publicación. Es obligatoria.
 */
const BasicPostSchema = object({
  title: string({ required_error: "title is required" }),
  description: string({ required_error: "description is required" }),
  type: z.enum(["event", "offer", "news"], {
    required_error: "type is required",
    invalid_type_error: "type must be one of 'event', 'offer', or 'news'",
  }),
  attachments: string().optional(),
  images: string().array().optional(),
  organizer_id: string({ required_error: "organizer_id is required" }),
  cities: string({ required_error: "cities is required" }).array(),
  tags: string({ required_error: "tags is required" }).array(),
});

/**
 * Esquema de validación para eventos.
 *
 * Extiende `BasicPostSchema` con los siguientes campos adicionales:
 * @property {"event"} type - Fijo en "event".
 * @property {Date} date - Fecha del evento. Se convierte automáticamente de string a Date.
 * @property {string} location - Ubicación del evento. Es obligatoria.
 * @property {string} registration_link - Enlace de registro al evento. Es obligatorio.
 */
const EventSchema = BasicPostSchema.extend({
  type: z.literal("event"),
  date: z.preprocess(
      (arg) => (arg ? new Date(arg as string) : undefined),
      z.date()
  ),
  location: string({ required_error: "location is required" }),
  registration_link: string({
    required_error: "registration_link is required",
  }),
});

/**
 * Esquema de validación para ofertas.
 *
 * Extiende `BasicPostSchema` con los siguientes campos adicionales:
 * @property {"offer"} type - Fijo en "offer".
 * @property {string} external_link - Enlace externo a la oferta. Es obligatorio.
 * @property {Date} deadline - Fecha límite para la oferta. Se convierte automáticamente de string a Date.
 */
const OfferSchema = BasicPostSchema.extend({
  type: z.literal("offer"),
  external_link: string({ required_error: "external_link is required" }),
  deadline: z.preprocess(
      (arg) => (arg ? new Date(arg as string) : undefined),
      z.date()
  ),
});

/**
 * Esquema de validación para noticias.
 *
 * Extiende `BasicPostSchema` con los siguientes campos adicionales:
 * @property {"news"} type - Fijo en "news".
 * @property {string} author - Autor de la noticia. Es obligatorio.
 */
const NewsSchema = BasicPostSchema.extend({
  type: z.literal("news"),
  author: string({ required_error: "author is required" }),
});

/**
 * Esquema de validación para la creación de publicaciones.
 *
 * Puede ser un evento, una oferta o una noticia.
 */
export const CreatePostSchema = z.union([EventSchema, OfferSchema, NewsSchema]);

/**
 * Esquemas de validación para la actualización de publicaciones.
 *
 * Permiten la modificación parcial de eventos, ofertas y noticias.
 */
export const UpdateEventSchema = EventSchema.partial();
export const UpdateOfferSchema = OfferSchema.partial();
export const UpdateNewsSchema = NewsSchema.partial();

/**
 * Esquema de validación para la actualización de cualquier tipo de publicación.
 */
export const UpdatePostSchema = z.union([
  UpdateEventSchema,
  UpdateOfferSchema,
  UpdateNewsSchema,
]);
