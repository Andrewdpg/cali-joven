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
    const existingPost = { _id: mockPostId, title: "Original Title" };
    const updatedPost = mockDeep<PostDocument>();
    updatedPost.id = mockPostId;
    updatedPost.title = "Updated Post";

    it("debería actualizar un post por su ID", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
      (PostModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedPost);

      (PostModel.findById as jest.Mock).mockResolvedValue(existingPost);

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

    it("debería lanzar un error si el post no existe", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
      (PostModel.findById as jest.Mock).mockResolvedValue(null); // Simula que el post no existe

      await expect(
        postService.update(mockPostId, mockPostUpdate)
      ).rejects.toThrow(`Post with id ${mockPostId} not found`);

      expect(PostModel.findById).toHaveBeenCalledWith(mockPostId);
      expect(PostModel.findByIdAndUpdate).not.toHaveBeenCalled(); // Asegura que no se intente actualizar
    });
  });

  describe("delete", () => {
    const mockPostId = "507f191e810c19729de860ea";

    it("debería eliminar un post por su ID", async () => {
      jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
      (PostModel.findByIdAndDelete as jest.Mock).mockResolvedValue(true);

      await postService.delete(mockPostId);

      expect(PostModel.findByIdAndDelete).toHaveBeenCalledWith(mockPostId);
    });
  });

  describe("exists", () => {
    const mockPostId = "507f191e810c19729de860ea";

    it("debería devolver true si el post existe", async () => {
      (PostModel.exists as jest.Mock).mockResolvedValue(true);

      const result = await postService.exists(mockPostId);

      expect(result).toBe(true);
      expect(PostModel.exists).toHaveBeenCalledWith({ _id: mockPostId });
    });

    it("debería devolver false si el post no existe", async () => {
      (PostModel.exists as jest.Mock).mockResolvedValue(null);

      const result = await postService.exists(mockPostId);

      expect(result).toBe(false);
      expect(PostModel.exists).toHaveBeenCalledWith({ _id: mockPostId });
    });
  });
});
