import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export interface TalentSearchFilters {
  searchTerm?: string;
  skills?: string[];
  location?: string;
  availability?: boolean;
}

export const searchTalents = async (filters: TalentSearchFilters) => {
  try {
    const { searchTerm, skills, location } = filters;

    const andConditions: Prisma.TalentProfileWhereInput[] = [
      { isPublic: true },
    ];

    if (searchTerm) {
      andConditions.push({
        OR: [
          { user: { name: { contains: searchTerm, mode: "insensitive" } } },
          { headline: { contains: searchTerm, mode: "insensitive" } },
        ],
      });
    }

    if (location) {
      andConditions.push({
        OR: [
          { city: { contains: location, mode: "insensitive" } },
          { country: { contains: location, mode: "insensitive" } },
        ],
      });
    }

    // 3. Filter by Skills
    if (skills && skills.length > 0) {
      andConditions.push({
        skills: { hasSome: skills },
      });
    }

    const talents = await db.talentProfile.findMany({
      where: {
        AND: andConditions,
      },
      include: {
        user: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return talents;
  } catch (error) {
    console.error("SEARCH_ERROR", error);
    return [];
  }
};
