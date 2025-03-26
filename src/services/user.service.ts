import bcrypt from "bcrypt";
import mongoose, { Error } from "mongoose";
import { UserDocument, UserModel } from "../models";
import { User, UserBase, UserPublic, UserUpdate } from "../types";
import { AlreadyExistsError, NotFoundError, ValidationError } from "../exceptions";
import { userMapper } from "../mappers";

/**
 * Service class to handle user-related operations.
 */
class UserService {
  /**
   * Creates a new user.
   * @param user - The user data to create.
   * @throws {ReferenceError} If a user with the same email already exists.
   * @returns The created user document.
   */
  public async create(user: UserBase) {
    try {
      const userExists = (await this.findUserByEmail(user.email)) !== null;
      if (userExists) {
        throw new ReferenceError("User with that email already exists");
      }
      user.password = await bcrypt.hash(user.password, 10);

      // Cast UserBase to User
      const newUser: User = {
        ...user,
        authorities: [],
      };

      return await UserModel.create(newUser);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a user by their ID.
   * @param id - The ID of the user.
   * @throws {Error} If the ID is invalid.
   * @throws {NotFoundError} If no user is found with the given ID.
   * @returns The public user data.
   */
  public async findUserById(id: string): Promise<UserPublic | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError("Invalid user ID");
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

  /**
   * Retrieves a user by their email.
   * @param email - The email of the user.
   * @returns The user document or null if not found.
   */
  public async findUserByEmail(
    email: User["email"]
  ): Promise<UserDocument | null> {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all users.
   * @returns A list of all user documents.
   */
  public async findAllUsers() {
    try {
      return await UserModel.find();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates a user by their ID.
   * @param id - The ID of the user.
   * @param user - The updated user data.
   * @throws {Error} If the ID is invalid.
   * @returns The updated user document or null if not found.
   */
  public async updateUserById(
    id: string,
    user: UserUpdate
  ): Promise<UserDocument | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError("Invalid user ID");
      }

      return await UserModel.findByIdAndUpdate(id, user, {
        returnOriginal: false, // Return the updated document.
        new: true, // Ensure the updated document is returned.
      }).select("-password"); // Exclude the `password` field from the response.
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a user by their ID.
   * @param id - The ID of the user.
   * @param authenticatedUserId - The ID of the authenticated user.
   * @throws {Error} If the ID is invalid or the user tries to delete themselves.
   * @returns The public user data of the deleted user or null if not found.
   */
  public async deleteUserById(
    id: string,
    authenticatedUserId: string
  ): Promise<UserPublic | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError("Invalid user ID");
      }

      if (id === authenticatedUserId) {
        throw new ValidationError("You cannot delete your own account");
      }

      const user = await UserModel.findByIdAndDelete(id);
      if (!user) {
        return null;
      }

      return userMapper.DocumentToPublic(user);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a user by their email.
   * @param email - The email of the user.
   * @returns The deleted user document or null if not found.
   */
  public async deleteUserByEmail(
    email: User["email"]
  ): Promise<UserDocument | null> {
    try {
      return await UserModel.findOneAndDelete({ email });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Checks if a user exists by their ID.
   * @param id - The ID of the user.
   * @returns True if the user exists, false otherwise.
   */
  public async userExists(id: string): Promise<boolean> {
    return (await UserModel.exists({ id })) != null;
  }

  /**
   * Adds a role to a user.
   * @param userId - The ID of the user.
   * @param role - The role to add.
   * @throws {NotFoundError} If the user is not found.
   * @throws {AlreadyExistsError} If the user already has the role.
   * @returns The updated user document.
   */
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

  /**
   * Removes a role from a user.
   * @param userId - The ID of the user.
   * @param role - The role to remove.
   * @throws {NotFoundError} If the user is not found.
   * @returns The updated user document.
   */
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