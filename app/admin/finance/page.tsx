import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminFinancials } from "@/actions/admin/get-financials";
import { TransactionsTable } from "@/components/admin/finance/transactions-table";
import { PayoutRequests } from "@/components/admin/finance/payout-requests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, TrendingUp, Wallet } from "lucide-react";

export default async function AdminFinancePage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return redirect("/");

  const result = await getAdminFinancials();

  if (result.error || !result.success) {
    return <div>Failed to load financial data</div>;
  }

  const { totalRevenue, transactions, payoutRequests } = result.success;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Banknote className="h-6 w-6 text-slate-600" />
          Financial Overview
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Track platform revenue, commissions, and payouts.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Platform Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-slate-500 mt-1">+10% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Pending Payouts
            </CardTitle>
            <Wallet className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {payoutRequests.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Requests waiting for approval
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Transactions
          </h2>
          <TransactionsTable transactions={transactions} />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Action Required
          </h2>
          <PayoutRequests requests={payoutRequests} />
        </div>
      </div>
    </div>
  );
}
