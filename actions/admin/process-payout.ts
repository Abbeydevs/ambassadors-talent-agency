"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const processPayout = async (
  requestId: string,
  action: "APPROVE" | "REJECT",
  reason?: string
) => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const payout = await db.payoutRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!payout || payout.status !== "PENDING") {
      return { error: "Request not found or already processed" };
    }

    if (action === "REJECT") {
      await db.$transaction([
        db.payoutRequest.update({
          where: { id: requestId },
          data: {
            status: "REJECTED",
            rejectionReason: reason || "Rejected by Admin",
            processedAt: new Date(),
          },
        }),
        db.wallet.update({
          where: { userId: payout.userId },
          data: {
            balance: { increment: payout.amount },
          },
        }),
      ]);

      revalidatePath("/admin/finance");
      return { success: "Payout rejected and funds returned to wallet." };
    }

    if (action === "APPROVE") {
      await db.$transaction([
        db.payoutRequest.update({
          where: { id: requestId },
          data: {
            status: "PROCESSED",
            processedAt: new Date(),
          },
        }),
        db.transaction.create({
          data: {
            userId: payout.userId,
            amount: payout.amount,
            type: "WITHDRAWAL",
            status: "SUCCESSFUL",
            description: `Payout to ${payout.bankName} - ${payout.accountNumber}`,
          },
        }),
      ]);

      revalidatePath("/admin/finance");
      return { success: "Payout marked as processed." };
    }
  } catch (error) {
    console.error("Error processing payout:", error);
    return { error: "Failed to process request" };
  }
};
