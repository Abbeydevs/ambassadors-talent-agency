"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getAdminFinancials = async () => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const revenueAgg = await db.transaction.aggregate({
      where: {
        status: "SUCCESSFUL",
        type: { in: ["COMMISSION", "JOB_FEE"] },
      },
      _sum: { amount: true },
    });

    const totalRevenue = revenueAgg._sum.amount || 0;

    const transactions = await db.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: {
          select: { name: true, email: true, image: true },
        },
      },
    });

    const payoutRequests = await db.payoutRequest.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return {
      success: {
        totalRevenue,
        transactions,
        payoutRequests,
      },
    };
  } catch (error) {
    console.error("Error fetching admin financials:", error);
    return { error: "Failed to load financial data" };
  }
};
