"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
  Clock,
  Loader2,
  AlertCircle,
  Building2,
  CreditCard,
} from "lucide-react";
import { processPayout } from "@/actions/admin/process-payout";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

interface PayoutRequest {
  id: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string | null;
  };
}

interface PayoutRequestsProps {
  requests: PayoutRequest[];
}

export const PayoutRequests = ({ requests }: PayoutRequestsProps) => {
  const [isPending, startTransition] = useTransition();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const onApprove = (id: string) => {
    if (
      confirm(
        "Confirm that you have sent the money? This will mark the request as complete."
      )
    ) {
      startTransition(() => {
        processPayout(id, "APPROVE")
          .then((data) => {
            if (!data) return;
            if (data.error) toast.error(data.error);
            else toast.success(data.success);
          })
          .catch(() => toast.error("Something went wrong"));
      });
    }
  };

  const onReject = () => {
    if (!rejectingId) return;

    startTransition(() => {
      processPayout(rejectingId, "REJECT", rejectReason)
        .then((data) => {
          if (!data) return;
          if (data.error) toast.error(data.error);
          else {
            toast.success(data.success);
            setRejectingId(null);
            setRejectReason("");
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <Card className="border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-[#111827]">
          <div className="p-2 bg-[#FEF3C7] rounded-lg">
            <Clock className="h-4 w-4 text-[#F59E0B]" />
          </div>
          Pending Payouts
          {requests.length > 0 && (
            <span className="ml-auto text-xs font-medium bg-[#F59E0B] text-white px-2.5 py-1 rounded-full">
              {requests.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 bg-[#F9FAFB] rounded-full mb-3">
              <Clock className="h-6 w-6 text-[#9CA3AF]" />
            </div>
            <p className="text-sm text-[#6B7280] font-medium">
              No pending requests
            </p>
            <p className="text-xs text-[#9CA3AF] mt-1">
              All payouts have been processed
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="border border-[#E5E7EB] rounded-xl bg-white hover:border-[#1E40AF] transition-colors p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[#111827] text-sm">
                        {req.user.name}
                      </span>
                      <span className="text-xs bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-md font-medium border border-[#FDE68A]">
                        Pending
                      </span>
                    </div>
                    <div className="text-xs text-[#6B7280]">
                      {req.user.email}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#111827]">
                      {formatCurrency(req.amount)}
                    </div>
                    <div className="text-xs text-[#9CA3AF] mt-0.5">
                      {format(new Date(req.createdAt), "MMM d, yyyy")}
                    </div>
                  </div>
                </div>

                <div className="bg-[#F9FAFB] rounded-lg p-3 mb-3 border border-[#E5E7EB]">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg border border-[#E5E7EB]">
                      <Building2 className="h-4 w-4 text-[#6B7280]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-[#111827] mb-1">
                        {req.accountName}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                        <CreditCard className="h-3 w-3" />
                        <span className="font-medium">{req.bankName}</span>
                        <span className="text-[#9CA3AF]">•</span>
                        <span className="font-mono">{req.accountNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-[#EF4444] hover:text-[#DC2626] hover:bg-[#FEF2F2] border-[#FEE2E2] h-9 font-medium transition-colors"
                    onClick={() => setRejectingId(req.id)}
                    disabled={isPending}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white h-9 font-medium shadow-sm transition-all hover:shadow"
                    onClick={() => onApprove(req.id)}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Approve"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <AlertDialog
          open={!!rejectingId}
          onOpenChange={() => setRejectingId(null)}
        >
          <AlertDialogContent className="border-[#E5E7EB]">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#FEF2F2] rounded-full">
                  <AlertCircle className="h-5 w-5 text-[#EF4444]" />
                </div>
                <AlertDialogTitle className="text-[#111827]">
                  Reject Payout Request
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-[#6B7280]">
                This will refund the money back to the talent&apos;s wallet.
                Please provide a reason for rejection.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-2">
              <Input
                placeholder="Reason (e.g. Invalid Account Number)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="border-[#E5E7EB] focus:border-[#1E40AF] focus:ring-[#1E40AF]"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={isPending}
                className="border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  onReject();
                }}
                disabled={isPending || !rejectReason}
                className="bg-[#EF4444] hover:bg-[#DC2626] text-white"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reject & Refund
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
