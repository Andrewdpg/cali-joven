export type UserBase = {
  name: string;
  email: string;
  password: string;
};

export type UserAuth = {
  authorities: string[];
};

export type User = UserBase & UserAuth;

export type UserPublic = {
  _id: string;
  name: User["name"];
  email: User["email"];
};

export type UserUpdate = {
  name?: string;
  email?: string;
  password?: string;
};

export type NotificationPreferences = {
  user: string;
  events: boolean;
  news: boolean;
  offers: boolean;
  organizations: string[];
  cities: string[];
};

export type Contact = {
  email: string;
  phone: string;
  social_media_links: string[];
};

export type UserSavedPost = {
  user_id: string;
  publication_id: string;
  saved_at: Date;
};
