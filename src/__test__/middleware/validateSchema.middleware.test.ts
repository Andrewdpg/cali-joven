import { validateSchema } from "../../middleware/validateSchema.middleware";
import { ZodObject, z } from "zod";
import { Request, Response, NextFunction } from "express";

describe("validateSchema middleware", () => {
  const schema: ZodObject<any> = z.object({
    name: z.string(),
  });

  const mockReq = { body: { data: { name: "Test" } } } as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;
  const mockNext = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debería llamar a next si la validación es exitosa", async () => {
    await validateSchema(schema)(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("debería devolver 400 si la validación falla", async () => {
    mockReq.body = { data: { name: 123 } }; // Valor inválido

    await validateSchema(schema)(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalled();
  });
});
