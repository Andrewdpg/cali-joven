import { ValidationError } from "../exceptions";
import { PostDocument, PostModel } from "../models/post.model";
import { Post, PostUpdate } from "../types/post.types";

class PostService {
  public async create(post: Post, user_id: string): Promise<PostDocument> {
    post.published_by = user_id;
    return await PostModel.create(post);
  }

  public async getAll(): Promise<PostDocument[]> {
    return await PostModel.find();
  }

  public async getById(id: string): Promise<PostDocument> {
    return await PostModel.findById(id).then((post) => {
      if (!post) {
        throw new Error(`Post with id ${id} not found`);
      }
      return post;
    });
  }

  public async getAttendableById(id: string): Promise<PostDocument> {
    const post = await this.getById(id);
    if (post.type !== "event") {
      throw new ValidationError("Must be an enrollable event");
    }
    return post;
  }

  public async update(
    id: string,
    post: PostUpdate
  ): Promise<PostDocument | null> {
    const existingPost = await PostModel.findById(id);
    if (!existingPost) {
      throw new Error(`Post with id ${id} not found`);
    }

    return await PostModel.findByIdAndUpdate(id, post, {
      returnOriginal: false,
    });
  }

  public async delete(id: string): Promise<void> {
    await PostModel.findByIdAndDelete(id);
  }

  private async exists(id: string): Promise<boolean> {
    return await PostModel.exists({ _id: id }).then(
      (result) => result !== null
    );
  }
}

export const postService = new PostService();
