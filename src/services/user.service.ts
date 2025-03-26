import bcrypt from "bcrypt";
import mongoose, { Error } from "mongoose";
import { UserDocument, UserModel } from "../models";
import { User, UserBase, UserPublic, UserUpdate } from "../types";
import { AlreadyExistsError, NotFoundError } from "../exceptions";
import { userMapper } from "../mappers";

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
        throw new NotFoundError(`User with id ${id} not found`);
      }
      return userMapper.DocumentToPublic(user);
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

  public async updateUserById(
    id: string,
    user: UserUpdate
  ): Promise<UserDocument | null> {
    try {
      // Validar que el ID sea un ObjectId válido
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid user ID");
      }

      // Actualizar el usuario
      return await UserModel.findByIdAndUpdate(id, user, {
        returnOriginal: false, // Devuelve el documento actualizado
        new: true, // Asegura que se devuelva el documento actualizado
      }).select("-password"); // Excluir el campo `password` de la respuesta
    } catch (error) {
      throw error;
    }
  }

  public async deleteUserById(
    id: string,
    authenticatedUserId: string
  ): Promise<UserPublic | null> {
    try {
      // Validar que el ID sea un ObjectId válido
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid user ID");
      }

      // Verificar si el usuario intenta eliminarse a sí mismo
      if (id === authenticatedUserId) {
        throw new Error("You cannot delete your own account");
      }

      // Eliminar el usuario
      const user = await UserModel.findByIdAndDelete(id);
      if (!user) {
        return null;
      }

      return userMapper.DocumentToPublic(user);
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

  public async userExists(id: string): Promise<boolean> {
    return (await UserModel.exists({ id })) != null;
  }

  public async addRoleToUser(userId: string, role: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.authorities.includes(role)) {
      throw new AlreadyExistsError("User already has this role");
    }

    user.authorities.push(role);
    await user.save();
    return user;
  }

  public async removeRoleFromUser(userId: string, role: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    user.authorities = user.authorities.filter((r) => r !== role);
    await user.save();
    return user;
  }
}

export const userService = new UserService();
