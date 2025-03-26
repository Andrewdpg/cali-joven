import {
  toCreationResponse,
  toUpdateResponse,
  toDeleteResponse,
  toErrorResponse,
} from "../../mappers";

describe("Response Mappers", () => {
  const mockResource = {
    id: "507f191e810c19729de860ea",
    name: "Test Resource",
  };

  describe("toCreationResponse", () => {
    it("debería devolver una respuesta de creación", () => {
      const result = toCreationResponse(mockResource);

      expect(result).toMatchObject({
        success: true,
        message: "Resource created",
        data: {
          resource: mockResource,
        },
        version: "1.0.0",
      });
      expect(result.data.createdAt).toBeInstanceOf(Date);
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });

  describe("toUpdateResponse", () => {
    it("debería devolver una respuesta de actualización", () => {
      const result = toUpdateResponse(mockResource);

      expect(result).toMatchObject({
        success: true,
        message: "Resource updated",
        data: {
          resource: mockResource,
        },
        version: "1.0.0",
      });
      expect(result.data.updatedAt).toBeInstanceOf(Date);
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });

  describe("toDeleteResponse", () => {
    it("debería devolver una respuesta de eliminación", () => {
      const result = toDeleteResponse();

      expect(result).toMatchObject({
        success: true,
        message: "Resource deleted",
        version: "1.0.0",
      });
      expect(result.data.deletedAt).toBeInstanceOf(Date);
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });

  describe("toErrorResponse", () => {
    it("debería devolver una respuesta de error", () => {
      const result = toErrorResponse(400, "Bad Request");

      expect(result).toMatchObject({
        success: false,
        message: "Error",
        error: {
          code: 400,
          details: "Bad Request",
        },
        version: "1.0.0",
      });
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });
});
