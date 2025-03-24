import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config";
import { TokenPayload } from "../types";

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  const token: string | undefined = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(401).send("Access denied. No token provided.");
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    const originalData = {...req.body}
    req.body = {
      data: originalData,
      payload: decoded,
    };
  } catch (ex) {
    if (ex instanceof jwt.TokenExpiredError) {
      res.status(401).send("Access denied. Token expired.");
      return;
    }
    res.status(400).send(ex);
  }

  next();
};
