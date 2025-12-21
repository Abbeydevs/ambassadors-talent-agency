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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            className="pl-8 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company / User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No employers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployers.map((emp) => {
                const isVerified = emp.employerProfile?.isVerified || false;
                const companyName = emp.companyName || "No Company Name";

                return (
                  <TableRow
                    key={emp.id}
                    className={emp.isSuspended ? "bg-red-50/50" : ""}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={emp.image || ""} />
                          <AvatarFallback className="bg-slate-100 text-slate-600">
                            <Building2 className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-slate-900">
                            {companyName}{" "}
                            {emp.isSuspended && (
                              <Badge
                                variant="destructive"
                                className="h-5 text-[10px] px-1.5"
                              >
                                BANNED
                              </Badge>
                            )}
                          </span>
                          <span className="text-xs text-slate-500">
                            {emp.name} ({emp.email})
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={emp.emailVerified ? "outline" : "secondary"}
                      >
                        {emp.emailVerified ? "Email Verified" : "Unverified"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          isVerified
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-100 border-0"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-100 border-0"
                        }
                      >
                        {isVerified ? "Verified Business" : "Not Verified"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {format(new Date(emp.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={isPending}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Company</DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => onVerifyToggle(emp.id, isVerified)}
                          >
                            {isVerified ? (
                              <>
                                <ShieldAlert className="h-4 w-4" /> Revoke
                                Verification
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="h-4 w-4 text-blue-600" />{" "}
                                Verify Business
                              </>
                            )}
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              onSuspendToggle(emp.id, emp.isSuspended)
                            }
                            className={
                              emp.isSuspended
                                ? "text-green-600 focus:text-green-600"
                                : "text-red-600 focus:text-red-600"
                            }
                          >
                            {emp.isSuspended ? (
                              <>
                                <CheckCircle className="h-4 w-4" /> Activate
                                Account
                              </>
                            ) : (
                              <>
                                <Ban className="h-4 w-4" /> Suspend Account
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
    </div>
  );
};
