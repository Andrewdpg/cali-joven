import { Request, Response } from "express";
import { toCreationResponse, userMapper } from "../mappers";
import { errorWrapper } from "../middleware";
import { userService } from "../services";
import { UserBase } from "../types";

class UserController {
  // TODO: Agregar respuesta adecuada
  public async createUser(req: Request, res: Response) {
    const newUser = await userService.create(req.body.data as UserBase);
    res.status(201).json(newUser);
  }

  public getAllUsers(req: Request, res: Response) {
    return userService.findAllUsers().then((users) => {
      res.status(200).json(users);
    });
  }

  public getUserByEmail(req: Request, res: Response) {
    return userService.findUserByEmail(req.params.id).then((user) => {
      if (!user) {
        res.status(404).json(`User with id ${req.params.id} not found`);
        return;
      }
      res.status(200).json(user);
    });
  }

  public async updateUser(req: Request, res: Response) {
    return await userService
      .updateUserById(req.params.id, req.body.data)
      .then((user) => {
        if (!user) {
          res.status(404).json(`User with id ${req.params.id} not found`);
          return;
        }
        res.status(200).json(user);
      });
  }

  public async getUserById(req: Request, res: Response) {
    return await userService.findUserById(req.params.id).then((user) => {
      if (!user) {
        res.status(404).json(`User with id ${req.params.id} not found`);
        return;
      }
      res.status(200).json(user);
    });
  }

  public async deleteUser(req: Request, res: Response) {
    const authenticatedUserId = req.body.payload.user_id; // ID del usuario autenticado

    return await userService
      .deleteUserById(req.params.id, authenticatedUserId)
      .then((user) => {
        if (!user) {
          res.status(404).json(`User with id ${req.params.id} not found`);
          return;
        }
        res.status(200).json(user);
      });
  }

  // Agregar un rol a un usuario
  public addRoleToUser = errorWrapper(async (req: Request, res: Response) => {
    const { id: userId, role } = req.params;
    const user = await userService.addRoleToUser(userId, role);
    res.status(200).json(toCreationResponse(userMapper.DocumentToPublic(user)));
  });

  // Quitar un rol de un usuario
  public removeRoleFromUser = errorWrapper(
    async (req: Request, res: Response) => {
      const { id: userId, role } = req.params;
      const user = await userService.removeRoleFromUser(userId, role);
      res
        .status(200)
        .json(toCreationResponse(userMapper.DocumentToPublic(user)));
    }
  );
}

export const userController = new UserController();
