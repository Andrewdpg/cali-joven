import mongoose from "mongoose";
import { env } from "../config";

export const db = mongoose
  .connect(env.MONGO_URI)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log("Error connecting to database", err));
