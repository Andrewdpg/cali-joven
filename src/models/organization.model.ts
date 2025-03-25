import mongoose, { Schema } from "mongoose";
import { Organization } from "../types";

export type OrganizationDocument = Organization & mongoose.Document;

const organizationSchema = new Schema(
  {
    name: { type: String, required: true },
    acronym: { type: String, required: true, unique: true }, // Ej. "PDJ", "CDJ"
  },
  {
    timestamps: true, // Agrega `createdAt` y `updatedAt`
    collection: "organizations",
  }
);

export const OrganizationModel = mongoose.model<OrganizationDocument>(
  "Organization",
  organizationSchema
);