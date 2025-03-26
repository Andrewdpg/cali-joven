import mongoose from "mongoose";
import { postService } from "../../services/post.service";
import { userService } from "../../services/user.service";
import { PostDocument, PostModel } from "../../models/post.model";
import { ValidationError } from "../../exceptions";
import { mockDeep } from "jest-mock-extended";

jest.mock("../../models/post.model");
jest.mock("../../services/user.service");

describe("PostService", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("getAll", () => {
    const mockPosts = [mockDeep<PostDocument>(), mockDeep<PostDocument>()];

    it("debería devolver todos los posts", async () => {
      (PostModel.find as jest.Mock).mockResolvedValue(mockPosts);

      const result = await postService.getAll();

      expect(result).toEqual(mockPosts);
      expect(PostModel.find).toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    const mockPost = mockDeep<PostDocument>();
    mockPost.id = "validId";

    it("debería devolver un post por su ID", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
      (PostModel.findById as jest.Mock).mockResolvedValue(mockPost);

      const result = await postService.getById(mockPost.id);

      expect(result).toEqual(mockPost);
      expect(PostModel.findById).toHaveBeenCalledWith(mockPost.id);
    });

    it("debería lanzar un error si el ID es inválido", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false);

      await expect(postService.getById("invalidId")).rejects.toThrow(
        "Invalid post ID"
      );
    });

    it("debería lanzar un error si el post no existe", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
      (PostModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(postService.getById("validId")).rejects.toThrow(
        "Post with id validId not found"
      );
    });
  });

  describe("getAttendableById", () => {
    const mockPost = mockDeep<PostDocument>();
    mockPost.id = "validId";
    mockPost.type = "event";

    it("debería devolver un post si es un evento", async () => {
      jest.spyOn(postService, "getById").mockResolvedValue(mockPost);

      const result = await postService.getAttendableById(mockPost.id);

      expect(result).toEqual(mockPost);
      expect(postService.getById).toHaveBeenCalledWith(mockPost.id);
    });

    it("debería lanzar un error si el post no es un evento", async () => {
      const nonEventPost = mockDeep<PostDocument>();
      nonEventPost.id = "validId";
      nonEventPost.type = "news";

      jest.spyOn(postService, "getById").mockResolvedValue(nonEventPost);

      await expect(
        postService.getAttendableById(nonEventPost.id)
      ).rejects.toThrow("Must be an enrollable event");

      expect(postService.getById).toHaveBeenCalledWith(nonEventPost.id);
    });
  });

  describe("update", () => {
    const mockPostUpdate = { title: "Updated Post" };
    const mockPostId = "validId";
    const updatedPost = mockDeep<PostDocument>();
    updatedPost.id = mockPostId;
    updatedPost.title = "Updated Post";

    it("debería actualizar un post por su ID", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
      (PostModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedPost);

      const result = await postService.update(mockPostId, mockPostUpdate);

      expect(result).toEqual(updatedPost);
      expect(PostModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockPostId,
        mockPostUpdate,
        {
          returnOriginal: false,
        }
      );
    });

    it("debería lanzar un error si el ID es inválido", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false);

      await expect(
        postService.update("invalidId", mockPostUpdate)
      ).rejects.toThrow("Invalid post ID");
    });
  });
});