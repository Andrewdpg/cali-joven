import bcrypt from "bcrypt";
import { generateToken } from "../lib/jwt";
import { UserModel } from "../models";
import { AuthLogin, AuthLoginResponse, HTTPCode, UserAuth } from "../types";

/**
 * Service class to handle authentication-related operations.
 */
class AuthService {
  /**
   * Authenticates a user by verifying their email and password.
   * @param user - The login credentials containing email and password.
   * @throws {ReferenceError} If the user does not exist or the password is incorrect.
   * @returns An object containing the authenticated user's public data, a JWT token, and a success message.
   */
  public async login(user: AuthLogin): Promise<AuthLoginResponse> {
    try {
      // Check if a user with the provided email exists
      const userExists = await UserModel.findOne({ email: user.email });
      if (!userExists) {
        throw new ReferenceError("User with that email does not exist");
      }

      // Verify the provided password matches the stored hashed password
      const match = await bcrypt.compare(user.password, userExists.password);
      if (!match) {
        throw new ReferenceError("Incorrect password");
      }

      // Generate a JWT token for the authenticated user
      const token = await generateToken({
        user_id: userExists._id.toString(),
        authorities: userExists.authorities as UserAuth["authorities"],
      });

      // Return the authenticated user's public data, token, and success message
      return {
        user: {
          _id: userExists.id,
          name: userExists.name,
          email: userExists.email,
        },
        token: token,
        message: {
          content: "Login successful",
          code: HTTPCode.OK,
        },
      };
    } catch (error) {
      // Propagate any errors encountered during the login process
      throw error;
    }
  }
}

export const authService = new AuthService();