import { object, string, z } from "zod";

const BasicPostSchema = object({
  title: string({ required_error: "title is required" }),
  description: string({ required_error: "description is required" }),
  attachments: string().optional(),
  images: string().array().optional(),
  organizer_id: string({ required_error: "organizer_id is required" }),
  cities: string({ required_error: "cities is required" }).array(),
  tags: string({ required_error: "tags is required" }).array(),
});

const EventSchema = BasicPostSchema.extend({
  date: z.preprocess(
    (arg) => (arg ? new Date(arg as string) : undefined),
    z.date()
  ),
  location: string({ required_error: "location is required" }),
  registration_link: string({
    required_error: "registration_link is required",
  }),
});

const OfferSchema = BasicPostSchema.extend({
  external_link: string({ required_error: "external_link is required" }),
  deadline: z.preprocess(
    (arg) => (arg ? new Date(arg as string) : undefined),
    z.date()
  ),
});

const NewsSchema = BasicPostSchema.extend({
  author: string({ required_error: "author is required" }),
});

export const CreatePostSchema = z.union([EventSchema, OfferSchema, NewsSchema]);

export const UpdateEventSchema = EventSchema.partial();
export const UpdateOfferSchema = OfferSchema.partial();
export const UpdateNewsSchema = NewsSchema.partial();

export const UpdatePostSchema = z.union([
  UpdateEventSchema,
  UpdateOfferSchema,
  UpdateNewsSchema,
]);
