import mongoose, { Schema } from "mongoose";
import { EventAttendee } from "../types/post.types";

export type AttendeeDocument = EventAttendee &
  mongoose.Document & {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  };

const attendeeSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Referencia al modelo User
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true }, // Referencia al modelo Event
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
