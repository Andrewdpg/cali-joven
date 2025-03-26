import {
  errorHandler,
  errorWrapper,
} from "../../middleware/exception.middleware";
import { AppError } from "../../exceptions";
import { Request, Response, NextFunction } from "express";

describe("errorHandler middleware", () => {
  const mockReq = {} as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Mockea console.error
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debería manejar errores personalizados", () => {
    const error = new AppError("Custom error", 400);

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: "error",
      message: "Custom error",
    });
  });

  it("debería manejar errores no controlados", () => {
    const error = new Error("Unhandled error");

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: "error",
      message: "Internal Server Error",
    });
  });
});

describe("errorWrapper middleware", () => {
  it("debería capturar errores y pasarlos al middleware de errores", async () => {
    const mockReq = {} as Request;
    const mockRes = {} as Response;
    const mockNext = jest.fn() as NextFunction;

    const fn = jest.fn().mockRejectedValue(new Error("Async error"));

    await errorWrapper(fn)(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new Error("Async error"));
  });
});
