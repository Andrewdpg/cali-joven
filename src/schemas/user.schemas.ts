import { object, string, number } from "zod";

export const CreateUserSchema = object({
  name: string({ required_error: "Name is required" }),
  email: string({ required_error: "Email is required" }).email({
    message: "Invalid email",
  }),
  password: string({ required_error: "Password is required" }),
  age: number({ required_error: "Age is required" })
    .min(18, { message: "Age must be between 18 and 50" })
    .max(50, { message: "Age must be between 18 and 50" }),
});

export const LoginUserSchema = object({
  email: string({ required_error: "Email is required" }),
  password: string({ required_error: "Password is required" }),
});