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

export type Event = BasicPost & {
  type: "event";
  date: Date;
  location: string;
  registration_link: string;
};

export type Offer = BasicPost & {
  type: "offer";
  external_link: string;
  deadline: Date;
};

export type News = BasicPost & {
  type: "news";
  author: string;
};

export type Tag = {
  name: string;
  description: string;
};

export type Post = Event | Offer | News;

export type EventAttendee = {
  user: string;
  event: string;
  remainders: boolean;
};

export type PostUpdate = Partial<Post>;