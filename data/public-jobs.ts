import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export interface JobFilterParams {
  query?: string;
  category?: string;
  location?: string;
  type?: string;
  minSalary?: number;
  sort?: string;
  page?: number;
}

const ITEMS_PER_PAGE = 12;

export const getJobById = async (jobId: string) => {
  try {
    const job = await db.job.findUnique({
      where: {
        id: jobId,
      },
      include: {
        employer: {
          include: {
            user: true,
          },
        },
      },
    });

    return job;
  } catch {
    return null;
  }
};

export const getAllJobs = async (params: JobFilterParams) => {
  const { query, category, location, type, minSalary, sort, page = 1 } = params;
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const where: Prisma.JobWhereInput = {
    status: "PUBLISHED",
    AND: [
      query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              {
                employer: {
                  user: {
                    companyName: { contains: query, mode: "insensitive" },
                  },
                },
              },
            ],
          }
        : {},
      category ? { category: { equals: category, mode: "insensitive" } } : {},
      location ? { location: { contains: location, mode: "insensitive" } } : {},
      type ? { projectType: { equals: type, mode: "insensitive" } } : {},
      minSalary ? { salaryMax: { gte: minSalary } } : {},
    ],
  };

  let orderBy: Prisma.JobOrderByWithRelationInput = { createdAt: "desc" };

  switch (sort) {
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "salary-high":
      orderBy = { salaryMax: "desc" };
      break;
    case "salary-low":
      orderBy = { salaryMin: "asc" };
      break;
  }

  try {
    const [jobs, totalCount] = await Promise.all([
      db.job.findMany({
        where,
        orderBy,
        take: ITEMS_PER_PAGE,
        skip,
        include: {
          employer: {
            include: { user: true },
          },
        },
      }),
      db.job.count({ where }),
    ]);

    return {
      jobs,
      metadata: {
        totalCount,
        totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
        currentPage: page,
        hasNextPage: page * ITEMS_PER_PAGE < totalCount,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error("GET_ALL_JOBS_ERROR", error);
    return {
      jobs: [],
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

export const getRelatedJobs = async (
  currentJobId: string,
  category: string
) => {
  try {
    const jobs = await db.job.findMany({
      where: {
        category: category,
        id: { not: currentJobId },
        status: "PUBLISHED",
      },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        employer: {
          include: {
            user: true,
          },
        },
      },
    });

    return jobs;
  } catch {
    return [];
  }
};
