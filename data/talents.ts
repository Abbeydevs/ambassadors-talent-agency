import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export const getTalentsForSelect = async () => {
  try {
    const talents = await db.user.findMany({
      where: {
        role: Role.TALENT,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return talents;
  } catch (error) {
    console.error("Error fetching talents for select:", error);
    return [];
  }
};
