import { AvailabilityStatus, Gender } from "@prisma/client";
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

export const PhysicalAttributesSchema = z.object({
  height: z.coerce
    .number()
    .min(0, "Height must be a positive number")
    .optional(),
  weight: z.coerce
    .number()
    .min(0, "Weight must be a positive number")
    .optional(),
  bodyType: z.string().optional(),
  eyeColor: z.string().optional(),
  hairColor: z.string().optional(),
  ethnicity: z.string().optional(),
  languages: z.array(z.string()).optional(),
});

export const ProfessionalDetailsSchema = z.object({
  talentCategories: z.array(z.string()).min(1, "Select at least one category"),
  yearsOfExperience: z.coerce.number().min(0).optional(),
  skills: z.array(z.string()).optional(),
  unionMemberships: z.array(z.string()).optional(),
  availabilityStatus: z
    .nativeEnum(AvailabilityStatus)
    .default(AvailabilityStatus.AVAILABLE),
  willingToTravel: z.boolean().default(false),
});

export const PortfolioMediaSchema = z.object({
  photos: z
    .array(
      z.object({
        url: z.string().url(),
        publicId: z.string().optional(),
      })
    )
    .optional(),

  videos: z
    .array(
      z.object({
        url: z.string().url(),
        publicId: z.string().optional(),
      })
    )
    .optional(),

  audioSamples: z
    .array(
      z.object({
        url: z.string().url(),
        publicId: z.string().optional(),
      })
    )
    .optional(),

  resume: z.string().url().optional().or(z.literal("")),

  externalPortfolioLinks: z
    .array(z.string().url({ message: "Invalid URL" }))
    .optional(),

  socialMediaLinks: z
    .array(
      z.object({
        platform: z.string(),
        url: z.string().url(),
      })
    )
    .optional(),
});
