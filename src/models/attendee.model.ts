import mongoose from "mongoose";
import { EventAttendee } from "../types/post.types";

export type AttendeeDocument = EventAttendee &
  mongoose.Document & {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  };

const attendeeSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    event: { type: String, required: true },
    remainders: { type: Boolean, required: true },
  },
  {
    timestamps: true,
    collection: "attendees",
  }
);

attendeeSchema.index({ user: 1, event: 1 }, { unique: true });

export const AttendeeModel = mongoose.model<AttendeeDocument>(
  "Attendee",
  attendeeSchema
);
