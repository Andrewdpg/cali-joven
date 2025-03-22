import { Request, Response } from "express";
import { authService, userService } from "../services";
import { AuthLogin, UserBase } from "../types";

class AuthController {
  public async register(req: Request, res: Response) {
    try {
      const newAuth = await userService.create(req.body as UserBase);
      res.status(201).json(newAuth);
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
      const result = await authService.login(req.body as AuthLogin);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export const authController = new AuthController();
