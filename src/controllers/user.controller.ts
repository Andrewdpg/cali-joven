import { Request, Response } from "express";
import { toCreationResponse, userMapper } from "../mappers";
import { errorWrapper } from "../middleware";
import { userService } from "../services";
import { UserBase } from "../types";

/**
 * Controller handling user-related operations including:
 * creation, retrieval, updating, and deletion of users.
 */
class UserController {
  /**
   * Creates a new user in the system.
   * @param {Request} req - Express request object containing user data
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with the created user data
   */
  public createUser = errorWrapper(async (req: Request, res: Response) => {
    const newUser = await userService.create(req.body.data as UserBase);
    res.status(201).json(newUser);
  });

  /**
   * Retrieves all users from the system.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with an array of all users
   */
  public getAllUsers = errorWrapper(async (req: Request, res: Response) => {
    return userService.findAllUsers().then((users) => {
      res.status(200).json(users);
    });
  });

  /**
   * Retrieves a specific user by their email.
   * @param {Request} req - Express request object with user email in params
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with the requested user data
   */
  public getUserByEmail = errorWrapper(async (req: Request, res: Response) => {
    return userService.findUserByEmail(req.params.id).then((user) => {
      if (!user) {
        res.status(404).json(`User with id ${req.params.id} not found`);
        return;
      }
      res.status(200).json(user);
    });
  });

  /**
   * Updates an existing user by their ID.
   * @param {Request} req - Express request object with user ID and update data
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with the updated user data
   */
  public updateUser = errorWrapper(async (req: Request, res: Response) => {
    return await userService
      .updateUserById(req.params.id, req.body.data)
      .then((user) => {
        if (!user) {
          res.status(404).json(`User with id ${req.params.id} not found`);
          return;
        }
        res.status(200).json(user);
      });
  });

  /**
   * Retrieves a specific user by their ID.
   * @param {Request} req - Express request object with user ID in params
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with the requested user data
   */
  public getUserById = errorWrapper(async (req: Request, res: Response) => {
    return await userService.findUserById(req.params.id).then((user) => {
      if (!user) {
        res.status(404).json(`User with id ${req.params.id} not found`);
        return;
      }
      res.status(200).json(user);
    });
  });

  /**
   * Deletes a specific user by their ID.
   * @param {Request} req - Express request object with user ID in params
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with deletion confirmation
   */
  public deleteUser = errorWrapper(async (req: Request, res: Response) => {
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
  });

  /**
   * Adds a role to a specific user.
   * @param {Request} req - Express request object with user ID and role in params
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with updated user data
   */
  public addRoleToUser = errorWrapper(async (req: Request, res: Response) => {
    const { id: userId, role } = req.params;
    const user = await userService.addRoleToUser(userId, role);
    res.status(200).json(toCreationResponse(userMapper.DocumentToPublic(user)));
  });

  /**
   * Removes a role from a specific user.
   * @param {Request} req - Express request object with user ID and role in params
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with updated user data
   */
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
