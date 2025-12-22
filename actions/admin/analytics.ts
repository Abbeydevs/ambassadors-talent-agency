"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { startOfMonth, subMonths, format, endOfMonth } from "date-fns";

export const getAdminAnalytics = async () => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return null;
  }

  try {
    const totalUsers = await db.user.count({
      where: { role: { in: ["TALENT", "EMPLOYER"] } },
    });

    const activeJobs = await db.job.count({
      where: { status: "PUBLISHED" },
    });

    const totalJobs = await db.job.count();

    const revenueAgg = await db.transaction.aggregate({
      where: {
        status: "SUCCESSFUL",
        type: { in: ["COMMISSION", "JOB_FEE"] },
      },
      _sum: { amount: true },
    });

    const totalRevenueValue = revenueAgg._sum.amount || 0;

    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      months.push({
        date: date,
        label: format(date, "MMM"),
        start: startOfMonth(date),
        end: endOfMonth(date),
      });
    }

    const revenueChartData = await Promise.all(
      months.map(async (month) => {
        const monthlyRevenue = await db.transaction.aggregate({
          where: {
            status: "SUCCESSFUL",
            type: { in: ["COMMISSION", "JOB_FEE"] },
            createdAt: {
              gte: month.start,
              lte: month.end,
            },
          },
          _sum: { amount: true },
        });

        return {
          name: month.label,
          revenue: monthlyRevenue._sum.amount || 0,
        };
      })
    );

    const userGrowthData = await Promise.all(
      months.map(async (month) => {
        const count = await db.user.count({
          where: {
            createdAt: {
              gte: month.start,
              lte: month.end,
            },
            role: { in: ["TALENT", "EMPLOYER"] },
          },
        });

        return {
          name: month.label,
          users: count,
        };
      })
    );

    const formattedRevenue = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(totalRevenueValue);

    return {
      stats: {
        totalUsers,
        totalJobs,
        activeJobs,
        revenue: formattedRevenue,
      },
      charts: {
        userGrowth: userGrowthData,
        revenue: revenueChartData,
      },
    };
  } catch (error) {
    console.error("ANALYTICS_ERROR", error);
    return null;
  }
};
