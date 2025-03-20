export type UserBase = {
  name: string;
  email: string;
  password: string;
};

export type UserAuth = {
  authorities: string[];
};

export type User = UserBase &
  UserAuth & {
    age: number;
  };

export type UserPublic = {
  name: User["name"];
  email: User["email"];
  age: User["age"];
};

export type UserUpdate = {
  name?: string;
  email?: string;
  password?: string;
};
