import { ValidationError } from "../exceptions";
import { PostDocument, PostModel } from "../models/post.model";
import { Post, PostUpdate } from "../types/post.types";

/**
 * Service class to handle post-related operations.
 */
class PostService {
  /**
   * Creates a new post.
   * @param post - The post data to create.
   * @param user_id - The ID of the user creating the post.
   * @returns The created post document.
   */
  public async create(post: Post, user_id: string): Promise<PostDocument> {
    post.published_by = user_id; // Assign the user ID as the publisher of the post.
    return await PostModel.create(post);
  }

  /**
   * Retrieves all posts.
   * @returns A list of all post documents.
   */
  public async getAll(): Promise<PostDocument[]> {
    return await PostModel.find();
  }

  /**
   * Retrieves a post by its ID.
   * @param id - The ID of the post.
   * @throws {Error} If no post is found with the given ID.
   * @returns The post document.
   */
  public async getById(id: string): Promise<PostDocument> {
    return await PostModel.findById(id).then((post) => {
      if (!post) {
        throw new Error(`Post with id ${id} not found`);
      }
      return post;
    });
  }

  /**
   * Retrieves an attendable post by its ID.
   * @param id - The ID of the post.
   * @throws {ValidationError} If the post is not of type "event".
   * @returns The attendable post document.
   */
  public async getAttendableById(id: string): Promise<PostDocument> {
    const post = await this.getById(id);
    if (post.type !== "event") {
      throw new ValidationError("Must be an enrollable event");
    }
    return post;
  }

  /**
   * Updates a post by its ID.
   * @param id - The ID of the post.
   * @param post - The updated post data.
   * @throws {Error} If no post is found with the given ID.
   * @returns The updated post document or null if not found.
   */
  public async update(
    id: string,
    post: PostUpdate
  ): Promise<PostDocument | null> {
    const existingPost = await PostModel.findById(id);
    if (!existingPost) {
      throw new Error(`Post with id ${id} not found`);
    }

    return await PostModel.findByIdAndUpdate(id, post, {
      returnOriginal: false, // Return the updated document.
    });
  }

  /**
   * Deletes a post by its ID.
   * @param id - The ID of the post.
   */
  public async delete(id: string): Promise<void> {
    await PostModel.findByIdAndDelete(id);
  }

  /**
   * Checks if a post exists by its ID.
   * @param id - The ID of the post.
   * @returns True if the post exists, false otherwise.
   */
  public async exists(id: string): Promise<boolean> {
    return await PostModel.exists({ _id: id }).then(
      (result) => result !== null
    );
  }
}

export const postService = new PostService();