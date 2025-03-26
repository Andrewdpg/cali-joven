import { wrapBody } from "../../middleware/bodyWrap.middleware";
import { Request, Response, NextFunction } from "express";

describe("wrapBody middleware", () => {
  it("debería envolver el cuerpo de la solicitud en un objeto 'data'", () => {
    const mockReq = { body: { key: "value" } } as Request;
    const mockRes = {} as Response;
    const mockNext = jest.fn() as NextFunction;

    wrapBody(mockReq, mockRes, mockNext);

    expect(mockReq.body).toEqual({ data: { key: "value" } });
    expect(mockNext).toHaveBeenCalled();
  });
});
