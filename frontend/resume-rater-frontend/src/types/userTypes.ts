import { z } from "zod";

export type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  retypePassword?: string;
};

export const registrationSchema = z.object({
  name: z
    .string()
    .min(5, "Name must be at least 5 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFieldErrors = {
  email?: string;
  password?: string;
};

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});