import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { env } from "../config";

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  const token: string | undefined = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(401).send("Access denied. No token provided.");
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.body.user = decoded;
  } catch (ex) {
    if (ex instanceof jwt.TokenExpiredError) {
      res.status(401).send("Access denied. Token expired.");
      return;
    }
    res.status(400).send(ex);
  }

  next();
};
