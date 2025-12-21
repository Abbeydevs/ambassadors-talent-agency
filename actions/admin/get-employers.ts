"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export const getAdminEmployers = async (query: string = "") => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const where: Prisma.UserWhereInput = {
      role: "EMPLOYER",
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { companyName: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    };

    const employers = await db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        companyName: true,
        employerProfile: {
          select: {
            companyName: true,
            isVerified: true,
          },
        },
      },
    });

    return { success: employers };
  } catch (error) {
    console.error("Error fetching employers:", error);
    return { error: "Failed to fetch employers" };
  }
};
