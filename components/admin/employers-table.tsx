"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  MoreHorizontal,
  Building2,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  Ban,
  Pencil,
  History,
  Eye,
  Briefcase,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { toggleEmployerVerification } from "@/actions/admin/verify-employer";
import { toggleUserSuspension } from "@/actions/admin/suspend-user";
import { EditUserDialog } from "./edit-user-dialog";
import { ActivityLogsDialog } from "./activity-logs-dialog";
import { HiringHistoryDialog } from "./hiring-history-dialog";

type UserRole = "ADMIN" | "TALENT" | "EMPLOYER" | "USER";

interface EmployerUser {
  id: string;
  name: string | null;
  companyName: string | null;
  email: string | null;
  image: string | null;
  role: UserRole | string;
  emailVerified: Date | null;
  createdAt: Date;
  isSuspended: boolean;
  employerProfile: {
    isVerified: boolean;
  } | null;
}

interface EmployersTableProps {
  employers: EmployerUser[];
}

export const EmployersTable = ({ employers }: EmployersTableProps) => {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [editingUser, setEditingUser] = useState<EmployerUser | null>(null);
  const [viewingLogsUser, setViewingLogsUser] = useState<EmployerUser | null>(
    null
  );
  const [viewingHistoryUser, setViewingHistoryUser] =
    useState<EmployerUser | null>(null);

  const filteredEmployers = employers.filter(
    (emp) =>
      emp.name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.email?.toLowerCase().includes(search.toLowerCase()) ||
      emp.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  const onVerifyToggle = (userId: string, currentStatus: boolean) => {
    startTransition(() => {
      toggleEmployerVerification(userId, !currentStatus)
        .then((data) => {
          if (data.error) toast.error(data.error);
          else toast.success(data.success);
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const onSuspendToggle = (userId: string, currentStatus: boolean) => {
    startTransition(() => {
      toggleUserSuspension(userId, !currentStatus)
        .then((data) => {
          if (data.error) toast.error(data.error);
          else toast.success(data.success);
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const verifiedCount = employers.filter(
    (e) => e.employerProfile?.isVerified
  ).length;
  const suspendedCount = employers.filter((e) => e.isSuspended).length;
  const activeCount = employers.filter((e) => !e.isSuspended).length;

  return (
    <div className="space-y-6">
      {editingUser && (
        <EditUserDialog
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          user={{
            id: editingUser.id,
            name: editingUser.name,
            email: editingUser.email,
            companyName: editingUser.companyName,
            role: "EMPLOYER",
          }}
        />
      )}

      {viewingLogsUser && (
        <ActivityLogsDialog
          isOpen={!!viewingLogsUser}
          onClose={() => setViewingLogsUser(null)}
          userId={viewingLogsUser.id}
          userName={
            viewingLogsUser.companyName || viewingLogsUser.name || "User"
          }
        />
      )}

      {viewingHistoryUser && (
        <HiringHistoryDialog
          isOpen={!!viewingHistoryUser}
          onClose={() => setViewingHistoryUser(null)}
          userId={viewingHistoryUser.id}
          companyName={
            viewingHistoryUser.companyName ||
            viewingHistoryUser.name ||
            "Company"
          }
        />
      )}

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by company or email..."
            className="pl-10 bg-white border-gray-200 focus-visible:ring-blue-600 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="border-gray-200 hover:bg-gray-50 h-10"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Total Employers</p>
            <div className="h-8 w-8 bg-gray-50 rounded-lg flex items-center justify-center">
              <Building2 className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{employers.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Verified</p>
            <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">{verifiedCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Suspended</p>
            <div className="h-8 w-8 bg-red-50 rounded-lg flex items-center justify-center">
              <Ban className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600">{suspendedCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Active</p>
            <div className="h-8 w-8 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">{activeCount}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-linear-to-r from-gray-50 to-gray-100/50 hover:bg-linear-to-r hover:from-gray-50 hover:to-gray-100/50 border-b border-gray-200">
              <TableHead className="font-semibold text-gray-900 py-4">
                Company / User
              </TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">
                Verification
              </TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">
                Joined Date
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-900 py-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Building2 className="h-12 w-12 mb-2 text-gray-300" />
                    <p className="font-medium">No employers found</p>
                    <p className="text-sm text-gray-400">
                      Try adjusting your search
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployers.map((emp) => {
                const isVerified = emp.employerProfile?.isVerified || false;
                const companyName = emp.companyName || "No Company Name";

                return (
                  <TableRow
                    key={emp.id}
                    className={`border-b border-gray-100 hover:bg-blue-50/30 transition-all duration-200 ${
                      emp.isSuspended ? "bg-red-50/40" : ""
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3 py-1">
                        <Avatar className="h-11 w-11 border-2 border-white shadow-sm ring-2 ring-gray-100">
                          <AvatarImage src={emp.image || ""} />
                          <AvatarFallback className="bg-linear-to-br from-amber-500 to-amber-600 text-white font-semibold">
                            <Building2 className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-gray-900">
                              {companyName}
                            </span>
                            {emp.isSuspended && (
                              <Badge
                                variant="destructive"
                                className="h-5 text-[10px] px-2 py-0.5 bg-red-100 text-red-700 hover:bg-red-100 border border-red-200 font-semibold"
                              >
                                SUSPENDED
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 font-medium">
                            {emp.name} ({emp.email})
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          emp.emailVerified
                            ? "bg-green-50 text-green-700 hover:bg-green-50 border border-green-200 shadow-sm font-medium"
                            : "bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200 shadow-sm font-medium"
                        }
                      >
                        {emp.emailVerified ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1.5" />
                            Email Verified
                          </>
                        ) : (
                          "Unverified"
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          isVerified
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200 shadow-sm font-medium"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-sm font-medium"
                        }
                      >
                        {isVerified ? (
                          <>
                            <ShieldCheck className="h-3 w-3 mr-1.5" />
                            Verified Business
                          </>
                        ) : (
                          "Not Verified"
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm font-medium">
                      {format(new Date(emp.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg"
                            disabled={isPending}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-56 shadow-lg border-gray-200"
                        >
                          <DropdownMenuLabel className="text-gray-900 font-semibold">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            View Company
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => onVerifyToggle(emp.id, isVerified)}
                            className="cursor-pointer"
                          >
                            {isVerified ? (
                              <>
                                <ShieldAlert className="h-4 w-4 mr-2 text-amber-600" />
                                Revoke Verification
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="h-4 w-4 mr-2 text-blue-600" />
                                Verify Business
                              </>
                            )}
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setEditingUser(emp)}
                            className="cursor-pointer"
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Info
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setViewingHistoryUser(emp)}
                            className="cursor-pointer"
                          >
                            <Briefcase className="h-4 w-4 mr-2" />
                            View Hiring History
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setViewingLogsUser(emp)}
                            className="cursor-pointer"
                          >
                            <History className="h-4 w-4 mr-2" />
                            View Activity Logs
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              onSuspendToggle(emp.id, emp.isSuspended)
                            }
                            className={`cursor-pointer ${
                              emp.isSuspended
                                ? "text-green-600 focus:text-green-600 focus:bg-green-50"
                                : "text-red-600 focus:text-red-600 focus:bg-red-50"
                            }`}
                          >
                            {emp.isSuspended ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Activate Account
                              </>
                            ) : (
                              <>
                                <Ban className="h-4 w-4 mr-2" />
                                Suspend Account
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results footer */}
      {filteredEmployers.length > 0 && (
        <div className="flex items-center justify-between text-sm bg-white border border-gray-200 rounded-lg px-5 py-3">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredEmployers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {employers.length}
            </span>{" "}
            employers
          </p>
        </div>
      )}
    </div>
  );
};
