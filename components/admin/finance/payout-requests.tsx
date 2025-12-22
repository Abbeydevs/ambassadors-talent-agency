"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Clock, Loader2 } from "lucide-react";
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-500" />
          Pending Payouts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            No pending payout requests.
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="flex flex-col border rounded-lg bg-slate-50 p-3 gap-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">
                      {req.user.name}
                    </span>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      Pending
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    Requested:{" "}
                    <span className="font-medium text-slate-900">
                      {formatCurrency(req.amount)}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400">
                  {format(new Date(req.createdAt), "MMM d")}
                </div>
              </div>

              <div className="text-xs text-slate-500 bg-white p-2 rounded border">
                <div className="font-medium">{req.accountName}</div>
                <div className="font-mono">
                  {req.bankName} • {req.accountNumber}
                </div>
              </div>

              <div className="flex gap-2 mt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-8"
                  onClick={() => setRejectingId(req.id)}
                  disabled={isPending}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white h-8"
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
          ))
        )}

        {/* Reject Dialog */}
        <AlertDialog
          open={!!rejectingId}
          onOpenChange={() => setRejectingId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Payout Request</AlertDialogTitle>
              <AlertDialogDescription>
                This will refund the money back to the talent&apos;s wallet.
                Please provide a reason.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-2">
              <Input
                placeholder="Reason (e.g. Invalid Account Number)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  onReject();
                }}
                disabled={isPending || !rejectReason}
                className="bg-red-600 hover:bg-red-700"
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
