import { Gender } from "@prisma/client";
import * as z from "zod";

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  role: z.enum(["TALENT", "EMPLOYER"]),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

export const PersonalDetailsSchema = z.object({
  name: z.string().min(1, { message: "Full name is required" }),
  stageName: z.string().optional(),

  image: z.string().optional(),

  dateOfBirth: z.date().optional(),
  gender: z.nativeEnum(Gender).optional(),

  country: z.string().min(1, { message: "Country is required" }),
  city: z.string().min(1, { message: "City is required" }),

  phone: z.string().min(10, { message: "Valid phone number is required" }),
  bio: z
    .string()
    .max(500, { message: "Bio must be less than 500 characters" })
    .optional(),
});
