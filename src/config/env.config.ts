import dotenv from "dotenv";

type Environment = {
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
};

dotenv.config();

const env: Environment = {
  PORT: Number.parseInt(process.env.PORT || "3000"),
  MONGO_URI: process.env.MONGO_URL || "mongodb://localhost:27017/express-ts",
  JWT_SECRET: process.env.JWT_SECRET || "a-pretty-secret-key",
};

export { env };
