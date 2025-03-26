import { authorize } from "../../middleware/authorize.middleware";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

jest.mock("jsonwebtoken");

describe("authorize middleware", () => {
  const mockReq = {} as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {}); // Mockea console.log
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debería devolver 401 si no se proporciona un token", () => {
    mockReq.headers = {};
    authorize()(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.send).toHaveBeenCalledWith(
      "Access denied. No token provided."
    );
  });

  it("debería devolver 403 si no se encuentran autoridades", () => {
    (jwt.verify as jest.Mock).mockReturnValue({ authorities: null });
    mockReq.headers = { authorization: "Bearer token" };
    mockReq.body = {};

    authorize(["admin"])(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Access denied. No authorities found.",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("debería llamar a next si el usuario tiene las autoridades requeridas", () => {
    (jwt.verify as jest.Mock).mockReturnValue({ authorities: ["admin"] });
    mockReq.headers = { authorization: "Bearer token" };

    authorize(["admin"])(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("debería devolver 401 si el token ha expirado", () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new jwt.TokenExpiredError("Token expired", new Date());
    });
    mockReq.headers = { authorization: "Bearer token" };

    authorize()(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.send).toHaveBeenCalledWith("Access denied. Token expired.");
  });
});
