"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export const getAdminTalents = async (query: string = "") => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const where: Prisma.UserWhereInput = {
      role: "TALENT",
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    };

    const talents = await db.user.findMany({
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
        isSuspended: true,
        talentProfile: {
          select: {
            isVerified: true,
          },
        },
      },
    });

    return { success: talents };
  } catch (error) {
    console.error("Error fetching talents:", error);
    return { error: "Failed to fetch talents" };
  }
};
