import mongoose from "mongoose";
import { User } from "../types/user.types";

export type UserDocument = User &
  mongoose.Document & {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  };

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
