import jwt from "jsonwebtoken";
import { env } from "../config";
import { TokenPayload } from "../types";

function generateToken(payload: TokenPayload): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!env.JWT_SECRET) {
            return reject(new Error("JWT_SECRET is not defined"));
        }

        jwt.sign(
            payload,
            env.JWT_SECRET,
            {
                expiresIn: "30d",
            },
            (err, token) => {
                if (err) {
                    reject(err);
                } else if (!token) {
                    reject(new Error("Token generation failed"));
                } else {
                    resolve(token);
                }
            }
        );
    });
}

export { generateToken };