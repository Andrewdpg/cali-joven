import { Request, Response } from "express";
import { postService } from "../services";
import { toCreationResponse } from "../mappers";

class PostCotroller {
  public async create(req: Request, res: Response) {
    try {
      const newPost = await postService.create(
        req.body.data,
        req.body.payload.user_id
      );
      res.status(201).json(toCreationResponse(newPost));
    } catch (error) {
      res.status(500).json(error);
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const posts = await postService.getAll();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  public async getById(req: Request, res: Response) {
    try {
      return await postService.getById(req.params.id).then((post) => {
        if (!post) {
          res.status(404).json(`Post with id ${req.params.id} not found`);
          return;
        }
        res.status(200).json(post);
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  public async delete(req: Request, res: Response) {}

  public async update(req: Request, res: Response) {
    try {
        const updatedPost = await postService.update(req.params.id, req.body.data);
        if (!updatedPost) {
            res.status(404).json(`Post with id ${req.params.id} not found`);
            return;
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json(error);
    }
  }
}

export const postController = new PostCotroller();
