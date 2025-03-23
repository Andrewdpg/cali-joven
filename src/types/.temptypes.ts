// TODO: Eliminar este archivo

export type Permission = {
  name: string;
  description: string;
};

export type Role = {
  name: string;
  description: string;
  permissions: string[];
};

export type User = {
  name: string;
  email: string;
  banned: boolean;
  password: string;
  position: string;
  role: string;
  preferences: string[];
  profile_picture: string;
  contact_info: string;
  city: string;
  organization: string;
};
