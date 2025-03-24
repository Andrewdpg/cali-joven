import bcrypt from "bcrypt";
import { generateToken } from "../lib/jwt";
import { UserModel } from "../models";
import { AuthLogin, AuthLoginResponse, HTTPCode, UserAuth } from "../types";

class AuthService {
  public async login(user: AuthLogin): Promise<AuthLoginResponse> {
    try {
      const userExists = await UserModel.findOne({ email: user.email });
      if (!userExists) {
        throw new ReferenceError("User with that email does not exist");
      }
      const match = await bcrypt.compare(user.password, userExists.password);
      if (!match) {
        throw new ReferenceError("Incorrect password");
      }

      const token = await generateToken({
        user_id: userExists._id.toString(),
        authorities: userExists.authorities as UserAuth["authorities"],
      });

      return {
        user: {
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
      throw error;
    }
  }
}

export const authService = new AuthService();
