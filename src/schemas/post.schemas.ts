import { object, string, z } from "zod";

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

const OfferSchema = BasicPostSchema.extend({
  type: z.literal("offer"),
  external_link: string({ required_error: "external_link is required" }),
  deadline: z.preprocess(
    (arg) => (arg ? new Date(arg as string) : undefined),
    z.date()
  ),
});

const NewsSchema = BasicPostSchema.extend({
  type: z.literal("news"),
  author: string({ required_error: "author is required" }),
});

export const CreatePostSchema = z.union([EventSchema, OfferSchema, NewsSchema]);

const UpdateBasicPostSchema = BasicPostSchema.partial();
const UpdateEventSchema = UpdateBasicPostSchema.extend({
  type: z.literal("event").optional(),
  date: z.preprocess(
    (arg) => (arg ? new Date(arg as string) : undefined),
    z.date()
  ).optional(),
  location: string().optional(),
  registration_link: string().optional(),
});
