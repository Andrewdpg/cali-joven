import { NextFunction, Request, Response } from "express";

export const wrapBody = (req: Request, res: Response, next: NextFunction): void => {
  req.body = { data: req.body };
  next();
};