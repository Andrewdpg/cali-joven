export type BasicPost = {
  title: string;
  description: string;
  type: string;
  attachments: string;
  images: string[];
  published_by: string;
  organizer_id: string;
  cities: string[];
  tags: string[];
};

export type Event = 
  BasicPost & {
  date: Date;
  location: string;
  registration_link: string;
};

export type Offer = 
  BasicPost & {
  type: string;
  external_link: string;
  deadline: Date;
};

export type News = 
  BasicPost & {
  author: string;
  tags: string[];
};

export type Tag = {
  name: string;
  description: string;
};

export type EventAttendee = {
  user: string;
  event: string; 
  remainders: boolean;
};

export type Post = Event | Offer | News;
