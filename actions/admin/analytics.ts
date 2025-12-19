"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  format,
  subMonths,
  eachMonthOfInterval,
  startOfMonth,
  endOfMonth,
} from "date-fns";

export const getAdminAnalytics = async () => {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return null;

  const totalUsers = await db.user.count();
  const totalJobs = await db.job.count();
  const activeJobs = await db.job.count({ where: { status: "PUBLISHED" } });

  const today = new Date();
  const sixMonthsAgo = subMonths(today, 6);

  const recentUsers = await db.user.findMany({
    where: {
      createdAt: {
        gte: sixMonthsAgo,
      },
    },
    select: { createdAt: true },
  });

  const months = eachMonthOfInterval({
    start: sixMonthsAgo,
    end: today,
  });

  const userGrowthData = months.map((month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const count = recentUsers.filter(
      (user) => user.createdAt >= monthStart && user.createdAt <= monthEnd
    ).length;

    return {
      name: format(month, "MMM"),
      users: count,
    };
  });

  const revenueData = [
    { name: "Jan", revenue: 120000 },
    { name: "Feb", revenue: 150000 },
    { name: "Mar", revenue: 180000 },
    { name: "Apr", revenue: 220000 },
    { name: "May", revenue: 250000 },
    { name: "Jun", revenue: 310000 },
  ];

  return {
    stats: {
      totalUsers,
      totalJobs,
      activeJobs,
      revenue: "NGN 1.2M",
    },
    charts: {
      userGrowth: userGrowthData,
      revenue: revenueData,
    },
  };
};
