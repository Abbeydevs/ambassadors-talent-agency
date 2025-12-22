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
import { ArrowUpRight, ArrowDownLeft, Download, Filter } from "lucide-react";

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

  // 👇 Filter Logic
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
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
            Deposit
          </Badge>
        );
      case "WITHDRAWAL":
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0">
            Withdrawal
          </Badge>
        );
      case "COMMISSION":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
            Commission
          </Badge>
        );
      case "JOB_FEE":
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-0">
            Job Fee
          </Badge>
        );
      default:
        return <Badge variant="outline">{type.replace("_", " ")}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-3 rounded-lg border">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-500" />

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] h-9">
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
            <SelectTrigger className="w-[140px] h-9">
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
          className="w-full sm:w-auto text-slate-700"
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No transactions found matching filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-slate-900">
                        {tx.user.name || "Unknown"}
                      </span>
                      <span className="text-xs text-slate-500">
                        {tx.user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(tx.type)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-medium">
                      {["DEPOSIT", "COMMISSION", "JOB_FEE"].includes(
                        tx.type
                      ) ? (
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={
                          ["DEPOSIT", "COMMISSION", "JOB_FEE"].includes(tx.type)
                            ? "text-green-600"
                            : "text-slate-900"
                        }
                      >
                        {formatCurrency(tx.amount)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-medium ${
                        tx.status === "SUCCESSFUL"
                          ? "text-green-600"
                          : "text-amber-600"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 font-mono">
                    {tx.reference || "-"}
                  </TableCell>
                  <TableCell className="text-right text-slate-500 text-sm">
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
