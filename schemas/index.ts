import { AvailabilityStatus, Gender, ProfileVisibility } from "@prisma/client";
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

const ExperienceItemSchema = z.object({
  projectTitle: z.string().min(1, "Project title is required"),
  role: z.string().min(1, "Role is required"),
  year: z.coerce
    .number()
    .min(1900, "Invalid year")
    .max(new Date().getFullYear() + 5, "Year cannot be too far in the future"),
  productionCompany: z.string().optional(),
  description: z.string().max(500, "Description is too long").optional(),
});

export const ExperienceListSchema = z.object({
  experience: z.array(ExperienceItemSchema),
});

export const ProfileSettingsSchema = z.object({
  profileVisibility: z.nativeEnum(ProfileVisibility),

  contactInfoVisibility: z
    .object({
      showEmail: z.boolean(),
      showPhone: z.boolean(),
    })
    .optional(),
});

export const SettingsSchema = z
  .object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email").optional(),
    password: z.string().min(6, "Minimum 6 characters").optional(),
    newPassword: z.string().min(6, "Minimum 6 characters").optional(),
    isTwoFactorEnabled: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Current password is required to change password",
      path: ["password"],
    }
  )
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New password is required",
      path: ["newPassword"],
    }
  );

export const CompanyProfileSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  image: z.string().optional(),

  companyDescription: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  industryType: z.string().min(1, "Industry is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),

  websiteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  companySize: z.coerce.number().optional(),
  foundedYear: z.coerce
    .number()
    .min(1800, "Invalid year")
    .max(new Date().getFullYear() + 1)
    .optional(),
});

export const JobPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description is too short"),
  category: z.string().min(1, "Category is required"),
  positions: z.coerce.number().min(1).default(1),

  roleDescription: z.string().optional(),
  skills: z.array(z.string()).optional(),
  minAge: z.coerce.number().min(0).optional(),
  maxAge: z.coerce.number().min(0).optional(),
  gender: z.string().optional(),
  ethnicity: z.string().optional(),

  location: z.string().min(1, "Location is required"),
  projectType: z.string().min(1, "Project type is required"),
  duration: z.string().optional(),
  startDate: z.date().optional(),

  isPaid: z.boolean().default(true),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  currency: z.string().default("NGN"),
  deadline: z.date().optional(),
  auditionDetails: z.string().optional(),

  attachments: z.array(z.string().url()).optional(),
  isFeatured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export const ApplicationSchema = z.object({
  coverLetter: z
    .string()
    .max(3000, "Cover letter cannot exceed 3000 characters")
    .optional(),
  attachments: z.array(z.string().url()).optional(),
});
