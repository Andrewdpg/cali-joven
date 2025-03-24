import { NextFunction, Request, Response } from "express";
import { TokenPayload } from "../types";

export const authorize = (requiredAuthorities: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.body.payload as TokenPayload;

    if (!user || !user.authorities) {
      res.status(403).json({ message: "Access denied. No authorities found." });
      return;
    }

    console.log("User authorities: ", user.authorities);

    const hasAuthority = requiredAuthorities.some((authority) =>
      user.authorities.includes(authority)
    );

    /** En caso de que se requieran todas las autoridades
    const hasAuthority = requiredAuthorities.every((authority) =>
        user.authorities.includes(authority)
    );
    */

    if (!hasAuthority) {
      res.status(403).json({ message: "Access denied. Insufficient authorities." });
      return;
    }

    next();
  };
};