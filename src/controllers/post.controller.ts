import { Request, Response } from "express";
import { toCreationResponse, toDeleteResponse } from "../mappers";
import { postService } from "../services";

class PostCotroller {
  public async create(req: Request, res: Response) {
    const newPost = await postService.create(
      req.body.data,
      req.body.payload.user_id
    );
    res.status(201).json(toCreationResponse(toCreationResponse(newPost)));
  }

  public async getAll(req: Request, res: Response) {
    const posts = await postService.getAll();
    res.status(200).json(posts);
  }

  public async getById(req: Request, res: Response) {
    const post = await postService.getById(req.params.id);
    res.status(200).json(post);
  }

  public async delete(req: Request, res: Response) {
    await postService.delete(req.params.id);
    res.status(200).json(toDeleteResponse);
  }

  public async update(req: Request, res: Response) {
    const updatedPost = await postService.update(req.params.id, req.body.data);
    res.status(200).json(updatedPost);
  }
}

export const postController = new PostCotroller();
