import { db } from "@/lib/db";
import { Prisma, Gender } from "@prisma/client";
import { subYears } from "date-fns";

export interface TalentFilterParams {
  query?: string;
  category?: string;
  location?: string;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  page?: number;
}

const ITEMS_PER_PAGE = 12;

export const getAllTalents = async (params: TalentFilterParams) => {
  const {
    query,
    category,
    location,
    gender,
    minAge,
    maxAge,
    page = 1,
  } = params;
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const where: Prisma.TalentProfileWhereInput = {
    AND: [
      query
        ? {
            OR: [
              { user: { name: { contains: query, mode: "insensitive" } } },
              { stageName: { contains: query, mode: "insensitive" } },
              { bio: { contains: query, mode: "insensitive" } },
              { headline: { contains: query, mode: "insensitive" } },
            ],
          }
        : {},
      category
        ? {
            talentCategories: {
              has: category,
            },
          }
        : {},
      location
        ? {
            OR: [
              { city: { contains: location, mode: "insensitive" } },
              { country: { contains: location, mode: "insensitive" } },
            ],
          }
        : {},
      gender ? { gender: { equals: gender as Gender } } : {},

      minAge ? { dateOfBirth: { lte: subYears(new Date(), minAge) } } : {},
      maxAge ? { dateOfBirth: { gte: subYears(new Date(), maxAge) } } : {},

      { profileVisibility: "PUBLIC" },
    ],
  };

  try {
    const [talents, totalCount] = await Promise.all([
      db.talentProfile.findMany({
        where,
        include: {
          user: true,
          photos: { take: 1 },
        },
        orderBy: {
          profileCompletion: "desc",
        },
        take: ITEMS_PER_PAGE,
        skip,
      }),
      db.talentProfile.count({ where }),
    ]);

    return {
      talents,
      metadata: {
        totalCount,
        totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
        currentPage: page,
        hasNextPage: page * ITEMS_PER_PAGE < totalCount,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error("GET_ALL_TALENTS_ERROR", error);
    return {
      talents: [],
      metadata: {
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
};
