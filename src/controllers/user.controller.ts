import { Request, Response } from "express";
import { User, UserLogin } from "../models";
import { userService } from "../services";

class UserController {
  public async CreateUser(req: Request, res: Response) {
    try {
      const newUser = await userService.create(req.body as User);
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof ReferenceError) {
        res.status(400).json(error.message);
        return;
      }
      res.status(500).json(error);
    }
  }

  public getAllUsers(req: Request, res: Response) {
    try {
      return userService.findAllUsers().then((users) => {
        res.status(200).json(users);
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  public getUserById(req: Request, res: Response) {
    try {
      return userService.findUserById(req.params.id).then((user) => {
        if (!user) {
          res.status(404).json(`User with id ${req.params.id} not found`);
          return;
        }
        res.status(200).json(user);
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  public async updateUser(req: Request, res: Response) {
    try {
      return await userService
        .updateUserById(req.params.id, req.body)
        .then((user) => {
          if (!user) {
            res.status(404).json(`User with id ${req.params.id} not found`);
            return;
          }
          res.status(200).json(user);
        });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  public async deleteUser(req: Request, res: Response) {
    try {
      return await userService.deleteUserById(req.params.id).then((user) => {
        if (!user) {
          res.status(404).json(`User with id ${req.params.id} not found`);
          return;
        }
        res.status(204).json();
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  public async loginUser(req: Request, res: Response) {
    try {
      const result = await userService.login(req.body as UserLogin);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export const userController = new UserController();
