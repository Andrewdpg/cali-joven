import mongoose from "mongoose";
import { Post } from "../types/post.types";

export type PostDocument = Post &
  mongoose.Document & {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  };

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type:  { type: String, required: true, enum: ["event", "offer", "news"] },
    attachments: { type: String },
    images: { type: [String], default: [] },
    published_by: { type: String, required: true },
    organizer_id: { type: String, required: true },
    cities: { type: [String], required: true, default: [] },
    tags: { type: [String], required: true, default: [] },

    date: { type: Date },
    location: { type: String },
    registration_link: { type: String },
    external_link: { type: String },
    deadline: { type: Date },
    author: { type: String },
  },
  {
    timestamps: true,
    collection: "posts",
  }
);

export const PostModel = mongoose.model<PostDocument>("Post", postSchema);