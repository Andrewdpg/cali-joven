import { boolean, object } from "zod";

export const AttendeeSchema = object({
  remainders: boolean({ required_error: "Parameter 'remainders' is required" }),
});
