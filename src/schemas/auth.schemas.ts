import { number, object, string } from "zod";

export const RegisterSchema = object({
  name: string({ required_error: "Name is required" }),
  email: string({ required_error: "Email is required" }).email({
    message: "Invalid email",
  }),
  password: string({ required_error: "Password is required" }).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&#]{8,}$/,
    {
      message:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number. Valid special characters: @ $ ! % * ? & #",
    }
  ),
});

export const LoginSchema = object({
  email: string({ required_error: "Email is required" }),
  password: string({ required_error: "Password is required" }),
});

export const ResetPasswordSchema = object({
  email: string({ required_error: "Email is required" }).email({
    message: "Invalid email",
  }),
  currentPassword: string({ required_error: "Password is required" }),
  newPassword: string({ required_error: "New password is required" }).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    {
      message:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number",
    }
  ),
});
