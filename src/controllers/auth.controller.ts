import { Request, Response } from "express";
import { generateToken } from "../lib/jwt";
import { authService, userService } from "../services";
import { AuthLogin, UserBase } from "../types";

class AuthController {
  // TODO: Mejorar respuesta
  // TODO: Mejorar datos del token
  // TODO: Mejorar output error
  public async register(req: Request, res: Response) {
    try {
      const newUser = await userService.create(req.body.data as UserBase);
      const token = await generateToken({
        user_id: newUser._id.toString(),
        authorities: newUser.authorities,
      });

      res.cookie("token", token);
      res.status(201).json({ token });
    } catch (error) {
      if (error instanceof ReferenceError) {
        res.status(400).json(error.message);
        return;
      }
      res.status(500).json(error);
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body.data as AuthLogin);
      res.cookie("token", result.token);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export const authController = new AuthController();
