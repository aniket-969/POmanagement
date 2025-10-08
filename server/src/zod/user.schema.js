import { z } from "zod";
import { stringValidation } from "../utils/customValidator.js";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .max(64, { message: "Password must not exceed 64 characters." })
  .refine((value) => /[0-9]/.test(value), {
    message: "Password must contain at least one numerical digit.",
  })
  .refine((value) => /[!@#$%^&*]/.test(value), {
    message: "Password must contain at least one special character.",
  });

export const registerSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(50, { message: "Email must be no more than 50 characters long" }),
  fullName: stringValidation(1, 50, "fullName"),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: stringValidation(1, 300, "email"),
  password: passwordSchema,
});
