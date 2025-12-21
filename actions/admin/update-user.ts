"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Prisma, Role } from "@prisma/client";

interface UpdateUserValues {
  userId: string;
  name: string;
  email: string;
  companyName?: string;
  role: Role | string;
}

export const adminUpdateUser = async (values: UpdateUserValues) => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const { userId, name, email, companyName, role } = values;

  if (!userId || !email) {
    return { error: "Missing required fields" };
  }

  try {
    const existingUser = await db.user.findFirst({
      where: {
        email: email,
        NOT: { id: userId },
      },
    });

    if (existingUser) {
      return { error: "Email is already in use by another account." };
    }

    const updateData: Prisma.UserUpdateInput = {
      name,
      email,
    };

    if (role === "EMPLOYER" && companyName !== undefined) {
      updateData.companyName = companyName;
    }

    await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    revalidatePath("/admin/talents");
    revalidatePath("/admin/employers");

    return { success: "User information updated successfully" };
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: "Failed to update user." };
  }
};
