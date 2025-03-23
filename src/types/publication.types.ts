export type Publication = {
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

export type Event = {
  publication_id: string;
  date: Date;
  location: string;
  registration_link: string;
};

export type Offer = {
  publication_id: string;
  type: string;
  external_link: string;
  deadline: Date;
};

export type News = {
  publication_id: string;
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
