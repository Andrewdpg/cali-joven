import mongoose from "mongoose";

export type BannerDocument = mongoose.Document & {
  title: string;
  image_url: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image_url: { type: String, required: true },
    link: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "banners",
  }
);

export const BannerModel = mongoose.model<BannerDocument>("Banner", bannerSchema);