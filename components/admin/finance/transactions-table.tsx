"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Filter,
  FileText,
} from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  reference: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    email: string | null;
  };
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

export const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = typeFilter === "ALL" || tx.type === typeFilter;
    const matchesStatus = statusFilter === "ALL" || tx.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const handleExport = () => {
    if (filteredTransactions.length === 0) return;

    const headers = [
      "Date",
      "User",
      "Email",
      "Type",
      "Amount",
      "Status",
      "Reference",
    ];

    const rows = filteredTransactions.map((tx) => [
      format(new Date(tx.createdAt), "yyyy-MM-dd HH:mm:ss"),
      tx.user.name || "Unknown",
      tx.user.email || "No Email",
      tx.type,
      tx.amount,
      tx.status,
      tx.reference || "N/A",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `financial_report_${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return (
          <Badge className="bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE] border-0 font-medium">
            Deposit
          </Badge>
        );
      case "WITHDRAWAL":
        return (
          <Badge className="bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7] border-0 font-medium">
            Withdrawal
          </Badge>
        );
      case "COMMISSION":
        return (
          <Badge className="bg-[#D1FAE5] text-[#065F46] hover:bg-[#D1FAE5] border-0 font-medium">
            Commission
          </Badge>
        );
      case "JOB_FEE":
        return (
          <Badge className="bg-[#E9D5FF] text-[#6B21A8] hover:bg-[#E9D5FF] border-0 font-medium">
            Job Fee
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="font-medium">
            {type.replace("_", " ")}
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESSFUL":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#10B981]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]"></span>
            Success
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F59E0B]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]"></span>
            Pending
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#EF4444]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444]"></span>
            Failed
          </span>
        );
      default:
        return (
          <span className="text-xs font-medium text-[#6B7280]">{status}</span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm">
        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          <div className="flex items-center gap-2 text-[#6B7280] font-medium text-sm">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[145px] h-9 border-[#E5E7EB] focus:border-[#1E40AF] focus:ring-[#1E40AF]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="COMMISSION">Commission</SelectItem>
              <SelectItem value="DEPOSIT">Deposit</SelectItem>
              <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
              <SelectItem value="JOB_FEE">Job Fee</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[145px] h-9 border-[#E5E7EB] focus:border-[#1E40AF] focus:ring-[#1E40AF]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="SUCCESSFUL">Successful</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="w-full sm:w-auto text-[#1E40AF] border-[#1E40AF] hover:bg-[#EFF6FF] hover:text-[#1E3A8A] font-medium h-9 transition-colors"
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <TableHead className="font-semibold text-[#111827]">
                User
              </TableHead>
              <TableHead className="font-semibold text-[#111827]">
                Type
              </TableHead>
              <TableHead className="font-semibold text-[#111827]">
                Amount
              </TableHead>
              <TableHead className="font-semibold text-[#111827]">
                Status
              </TableHead>
              <TableHead className="font-semibold text-[#111827]">
                Reference
              </TableHead>
              <TableHead className="text-right font-semibold text-[#111827]">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="p-3 bg-[#F9FAFB] rounded-full mb-3">
                      <FileText className="h-6 w-6 text-[#9CA3AF]" />
                    </div>
                    <p className="text-sm text-[#6B7280] font-medium">
                      No transactions found
                    </p>
                    <p className="text-xs text-[#9CA3AF] mt-1">
                      Try adjusting your filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((tx) => (
                <TableRow
                  key={tx.id}
                  className="hover:bg-[#F9FAFB] transition-colors border-b border-[#E5E7EB] last:border-0"
                >
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-[#111827]">
                        {tx.user.name || "Unknown"}
                      </span>
                      <span className="text-xs text-[#6B7280]">
                        {tx.user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(tx.type)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-semibold">
                      {["DEPOSIT", "COMMISSION", "JOB_FEE"].includes(
                        tx.type
                      ) ? (
                        <ArrowDownLeft className="h-4 w-4 text-[#10B981]" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-[#EF4444]" />
                      )}
                      <span
                        className={
                          ["DEPOSIT", "COMMISSION", "JOB_FEE"].includes(tx.type)
                            ? "text-[#10B981]"
                            : "text-[#111827]"
                        }
                      >
                        {formatCurrency(tx.amount)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(tx.status)}</TableCell>
                  <TableCell className="text-xs text-[#6B7280] font-mono">
                    {tx.reference || <span className="text-[#9CA3AF]">—</span>}
                  </TableCell>
                  <TableCell className="text-right text-[#6B7280] text-sm">
                    {format(new Date(tx.createdAt), "MMM d, HH:mm")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
