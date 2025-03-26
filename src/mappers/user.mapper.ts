import { UserDocument } from "../models";
import { UserPublic } from "../types";

class UserMapper {
  public DocumentToPublic(user: UserDocument): UserPublic {
    return {
      _id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}

export const userMapper = new UserMapper();