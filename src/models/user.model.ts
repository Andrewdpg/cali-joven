import mongoose, { Document, Schema } from "mongoose";
import { User } from "../types/user.types";

export type UserDocument = User &
  Document & {
    _id: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  };

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    authorities: { type: [String], required: true },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
