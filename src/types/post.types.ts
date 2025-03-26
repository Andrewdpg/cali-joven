/**
 * Tipo `BasicPost`
 *
 * Representa una publicación genérica en la plataforma.
 *
 * @property {string} title - Título de la publicación.
 * @property {string} description - Descripción del contenido de la publicación.
 * @property {"event" | "offer" | "news"} type - Tipo de publicación: evento, oferta o noticia.
 * @property {string} attachments - Enlace a archivos adjuntos relacionados con la publicación.
 * @property {string[]} images - Lista de URLs de imágenes asociadas a la publicación.
 * @property {string} published_by - Identificador del usuario que publicó el contenido.
 * @property {string} organizer_id - Identificador del organizador responsable de la publicación.
 * @property {string[]} cities - Lista de ciudades en las que aplica la publicación.
 * @property {string[]} tags - Lista de etiquetas asociadas a la publicación.
 */
export type BasicPost = {
  title: string;
  description: string;
  type: "event" | "offer" | "news";
  attachments: string;
  images: string[];
  published_by: string;
  organizer_id: string;
  cities: string[];
  tags: string[];
};

/**
 * Tipo `Event`
 *
 * Representa un evento publicado en la plataforma.
 *
 * @extends {BasicPost}
 * @property {"event"} type - Tipo de publicación, siempre "event".
 * @property {Date} date - Fecha del evento.
 * @property {string} location - Ubicación donde se llevará a cabo el evento.
 * @property {string} registration_link - Enlace para el registro de asistentes al evento.
 */
export type Event = BasicPost & {
  type: "event";
  date: Date;
  location: string;
  registration_link: string;
};

/**
 * Tipo `Offer`
 *
 * Representa una oferta publicada en la plataforma.
 *
 * @extends {BasicPost}
 * @property {"offer"} type - Tipo de publicación, siempre "offer".
 * @property {string} external_link - Enlace externo con más información sobre la oferta.
 * @property {Date} deadline - Fecha límite de la oferta.
 */
export type Offer = BasicPost & {
  type: "offer";
  external_link: string;
  deadline: Date;
};

/**
 * Tipo `News`
 *
 * Representa una noticia publicada en la plataforma.
 *
 * @extends {BasicPost}
 * @property {"news"} type - Tipo de publicación, siempre "news".
 * @property {string} author - Autor de la noticia.
 */
export type News = BasicPost & {
  type: "news";
  author: string;
};

/**
 * Tipo `Tag`
 *
 * Representa una etiqueta utilizada para clasificar publicaciones.
 *
 * @property {string} name - Nombre de la etiqueta.
 * @property {string} description - Descripción de la etiqueta.
 */
export type Tag = {
  name: string;
  description: string;
};

/**
 * Tipo `Post`
 *
 * Unión de los tipos `Event`, `Offer` y `News`, representando cualquier tipo de publicación en la plataforma.
 */
export type Post = Event | Offer | News;

/**
 * Tipo `EventAttendee`
 *
 * Representa un usuario registrado en un evento.
 *
 * @property {string} user - Identificador del usuario asistente.
 * @property {string} event - Identificador del evento al que se ha inscrito.
 * @property {boolean} remainders - Indica si el usuario ha activado recordatorios para el evento.
 */
export type EventAttendee = {
  user: string;
  event: string;
  remainders: boolean;
};

/**
 * Tipo `PostUpdate`
 *
 * Representa una actualización parcial de un `Post`.
 * Todos los atributos son opcionales.
 */
export type PostUpdate = Partial<Post>;
