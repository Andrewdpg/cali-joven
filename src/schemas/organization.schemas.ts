import { object, string } from "zod";

export const CreateOrganizationSchema = object({
  name: string({ required_error: "Name is required" }),
  acronym: string({ required_error: "Acronym is required" }),
});

export const UserToOrganizationSchema = object({
  role: string({ required_error: "Role is required" }),
});