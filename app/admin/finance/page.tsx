import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminFinancials } from "@/actions/admin/get-financials";
import { TransactionsTable } from "@/components/admin/finance/transactions-table";
import { PayoutRequests } from "@/components/admin/finance/payout-requests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, TrendingUp, Wallet, DollarSign } from "lucide-react";

export default async function AdminFinancePage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return redirect("/");

  const result = await getAdminFinancials();

  if (result.error || !result.success) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="p-4 bg-[#FEF2F2] rounded-full inline-block mb-4">
            <Banknote className="h-8 w-8 text-[#EF4444]" />
          </div>
          <p className="text-[#111827] font-semibold">
            Failed to load financial data
          </p>
          <p className="text-sm text-[#6B7280] mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  const { totalRevenue, transactions, payoutRequests } = result.success;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Section */}
      <div className="bg-white border-b border-[#E5E7EB] -mx-6 -mt-6 px-6 py-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#EFF6FF] rounded-xl">
            <Banknote className="h-6 w-6 text-[#1E40AF]" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
              Financial Overview
            </h1>
            <p className="text-[#6B7280] text-sm mt-1">
              Track platform revenue, commissions, and payouts in real-time
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-[#6B7280]">
              Total Platform Revenue
            </CardTitle>
            <div className="p-2 bg-[#D1FAE5] rounded-lg">
              <TrendingUp className="h-4 w-4 text-[#10B981]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#111827]">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center gap-1 text-xs font-semibold text-[#10B981]">
                <TrendingUp className="h-3 w-3" />
                <span>+10%</span>
              </div>
              <span className="text-xs text-[#9CA3AF]">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-[#6B7280]">
              Pending Payouts
            </CardTitle>
            <div className="p-2 bg-[#FEF3C7] rounded-lg">
              <Wallet className="h-4 w-4 text-[#F59E0B]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#111827]">
              {payoutRequests.length}
            </div>
            <p className="text-xs text-[#6B7280] mt-2">
              {payoutRequests.length === 1 ? "Request" : "Requests"} waiting for
              approval
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-[#6B7280]">
              Total Transactions
            </CardTitle>
            <div className="p-2 bg-[#DBEAFE] rounded-lg">
              <DollarSign className="h-4 w-4 text-[#1E40AF]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#111827]">
              {transactions.length}
            </div>
            <p className="text-xs text-[#6B7280] mt-2">
              Across all transaction types
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#111827]">
                Recent Transactions
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                View and filter all platform transactions
              </p>
            </div>
          </div>
          <TransactionsTable transactions={transactions} />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">
              Action Required
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Review and process payout requests
            </p>
          </div>
          <PayoutRequests requests={payoutRequests} />
        </div>
      </div>
    </div>
  );
}
