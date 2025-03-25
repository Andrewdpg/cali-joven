import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config";
import { TokenPayload } from "../types";

export const authorize = (requiredAuthorities: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const token: string | undefined =
      req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      res.status(401).send("Access denied. No token provided.");
      return;
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
      req.body.payload = decoded;

      if (!decoded || !decoded.authorities) {
        res
          .status(403)
          .json({ message: "Access denied. No authorities found." });
        return;
      }

      console.log("User authorities: ", decoded.authorities);

      const hasAuthority = requiredAuthorities.some((authority) =>
        decoded.authorities.includes(authority)
      );

      /** En caso de que se requieran todas las autoridades
      const hasAuthority = requiredAuthorities.every((authority) =>
          decoded.authorities.includes(authority)
      );
      */

      if (!hasAuthority) {
        res
          .status(403)
          .json({ message: "Access denied. Insufficient authorities." });
        return;
      }

      next();
    } catch (ex) {
      if (ex instanceof jwt.TokenExpiredError) {
        res.status(401).send("Access denied. Token expired.");
        return;
      }
      res.status(400).send(ex);
    }
  };
};
