import mongoose, { Schema } from "mongoose";
import { UserOrganization } from "../types";

export type UserOrganizationDocument = UserOrganization & mongoose.Document

const userOrganizationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    organization: {type: Schema.Types.ObjectId, ref: "Organization", required: true }
  },
  {
    timestamps: true,
    collection: "user_organizations",
  }
);

userOrganizationSchema.index({ user: 1, organization: 1 }, { unique: true });

export const UserOrganizationModel = mongoose.model<UserOrganizationDocument>(
  "UserOrganization",
  userOrganizationSchema
);
