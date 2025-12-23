"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { Role } from "@prisma/client";

const CreateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be 6+ chars"),
});

export const createAuthor = async (
  values: z.infer<typeof CreateUserSchema>
) => {
  const session = await auth();

  if (session?.user?.role !== Role.ADMIN) {
    return { error: "Unauthorized" };
  }

  const validated = CreateUserSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  const { name, email, password } = validated.data;

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Email already in use!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      name,
      email,
      hashedPassword,
      role: Role.AUTHOR,
      bio: "New author joining the team.",
    },
  });

  revalidatePath("/admin/authors");
  return { success: "Author account created!" };
};

const UpdateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
  image: z.string().optional(),
});

export const updateAuthor = async (
  userId: string,
  values: z.infer<typeof UpdateUserSchema>
) => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const validated = UpdateUserSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await db.user.update({
      where: { id: userId },
      data: {
        ...validated.data,
      },
    });

    revalidatePath("/admin/authors");
    return { success: "Author profile updated" };
  } catch (error) {
    console.error("Error updating author:", error);
    return { error: "Failed to update author" };
  }
};
