import { CommonResponse } from "./common.types";
import { UserPublic } from "./user.types";

export type AuthLogin = {
  email: string;
  password: string;
};

export type AuthLoginResponse = CommonResponse & {
  user: UserPublic;
  token: string;
};
