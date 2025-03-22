import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config";
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
      return {
        user: {
          name: userExists.name,
          email: userExists.email,
          age: userExists.age,
        },
        token: this.generateToken(userExists),
        message: {
          content: "Login successful",
          code: HTTPCode.OK,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  public generateToken(user: UserAuth): string {
    const token = jwt.sign({ user }, env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return token;
  }
}

export const authService = new AuthService();
