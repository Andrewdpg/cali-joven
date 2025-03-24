import mongoose from "mongoose";
import { PostDocument, PostModel } from "../models/post.model";
import { Post } from "../types/post.types";
import { userService } from "./user.service";

class PostService {
  public async create(post: Post, user_id: string): Promise<PostDocument> {
    try {
      if (!userService.userExists(user_id)) {
        throw new ReferenceError("User with that id does not exist");
      }

      post.published_by = user_id;

      return await PostModel.create(post);
    } catch (error) {
      throw error;
    }
  }

  public async getAll(): Promise<PostDocument[]> {
    try {
      return await PostModel.find();
    } catch (error) {
      throw error;
    }
  }

  public async getById(id: string): Promise<PostDocument> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid post ID");
      }
      const post = await PostModel.findById(id);
      if (!post) {
        throw new Error(`Post with id ${id} not found`);
      }
      return post;
    } catch (error) {
      throw error;
    }
  }
  //public async update(id: string, post: Post): Promise<PostDocument | null> {}
}

export const postService = new PostService();
