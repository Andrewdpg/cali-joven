import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { UserDocument, UserModel } from "../models";
import { User, UserBase, UserUpdate, UserPublic } from "../types";

class UserService {
  public async create(user: UserBase) {
    try {
      const userExists = (await this.findUserByEmail(user.email)) !== null;
      if (userExists) {
        throw new ReferenceError("User with that email already exists");
      }
      user.password = await bcrypt.hash(user.password, 10);

      // Castear UserBase a User
      const newUser: User = {
        ...user,
        authorities: [],
      };

      return await UserModel.create(newUser);
    } catch (error) {
      throw error;
    }
  }

  public async findUserById(id: string): Promise<UserPublic | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid user ID");
      }
      const user = await UserModel.findById(id);
      if (!user) {
        return null;
      }
      return this.toPublic(user);
    } catch (error) {
      throw error;
    }
  }

  public async findUserByEmail(
    email: User["email"]
  ): Promise<UserDocument | null> {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  public async findAllUsers() {
    try {
      return await UserModel.find();
    } catch (error) {
      throw error;
    }
  }

  public async updateUserByEmail(
    email: User["email"],
    user: UserUpdate
  ): Promise<UserDocument | null> {
    try {
      return await UserModel.findByIdAndUpdate({ email }, user, {
        returnOriginal: false,
      }).select("-password");
    } catch (error) {
      throw error;
    }
  }

  public async deleteUserById(
    id: string
  ): Promise<UserPublic | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid user ID");
      }
      const user = await UserModel.findByIdAndDelete(id);
      if (!user) {
        return null;
      }
      return this.toPublic(user);
    } catch (error) {
      throw error;
    }
  }

  public async deleteUserByEmail(
    email: User["email"]
  ): Promise<UserDocument | null> {
    try {
      return await UserModel.findOneAndDelete({ email });
    } catch (error) {
      throw error;
    }
  }

  private toPublic(user: UserDocument): UserPublic {
    return {
      name: user.name,
      email: user.email,
    };
  }
}

export const userService = new UserService();
