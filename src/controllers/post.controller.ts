import { Request, Response } from "express";
import { toCreationResponse, toDeleteResponse } from "../mappers";
import { postService } from "../services";
import { errorWrapper } from "../middleware";

/**
 * Controller handling all post-related operations including:
 * creation, retrieval, updating, and deletion of posts.
 */
class PostCotroller {
  /**
   * Creates a new post in the system.
   * @param {Request} req - Express request object containing post data and user ID
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with the created post data
   */
  public create = errorWrapper(async (req: Request, res: Response) => {
    const newPost = await postService.create(
      req.body.data,
      req.body.payload.user_id
    );
    res.status(201).json(toCreationResponse(newPost));
  });

  /**
   * Retrieves all posts from the system.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with an array of all posts
   */
  public getAll = errorWrapper(async (req: Request, res: Response) => {
    const posts = await postService.getAll();
    res.status(200).json(posts);
  });

  /**
   * Retrieves a specific post by its ID.
   * @param {Request} req - Express request object with post ID in params
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with the requested post data
   */
  public getById = errorWrapper(async (req: Request, res: Response) => {
    const post = await postService.getById(req.params.id);
    res.status(200).json(post);
  });

  /**
   * Deletes a specific post by its ID.
   * @param {Request} req - Express request object with post ID in params
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with deletion confirmation
   */
  public delete = errorWrapper(async (req: Request, res: Response) => {
    await postService.delete(req.params.id);
    res.status(200).json(toDeleteResponse);
  });

  /**
   * Updates an existing post by its ID.
   * @param {Request} req - Express request object with post ID and update data
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Responds with the updated post data
   */
  public update = errorWrapper(async (req: Request, res: Response) => {
    const updatedPost = await postService.update(req.params.id, req.body.data);
    res.status(200).json(updatedPost);
  });
}

export const postController = new PostCotroller();
