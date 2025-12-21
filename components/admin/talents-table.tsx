/* eslint-disable @typescript-eslint/no-unused-vars */
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
  User,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  Ban,
} from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toggleTalentVerification } from "@/actions/admin/verify-talent";
import { toast } from "sonner";
import { toggleUserSuspension } from "@/actions/admin/suspend-user";

type UserRole = "ADMIN" | "TALENT" | "EMPLOYER" | "USER";

interface TalentUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: UserRole | string;
  emailVerified: Date | null;
  createdAt: Date;
  isSuspended: boolean;
  talentProfile: {
    isVerified: boolean;
  } | null;
}

interface TalentsTableProps {
  talents: TalentUser[];
}

export const TalentsTable = ({ talents }: TalentsTableProps) => {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredTalents = talents.filter(
    (talent) =>
      talent.name?.toLowerCase().includes(search.toLowerCase()) ||
      talent.email?.toLowerCase().includes(search.toLowerCase())
  );

  const onVerifyToggle = (userId: string, currentStatus: boolean) => {
    startTransition(() => {
      toggleTalentVerification(userId, !currentStatus)
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
      {/* Search Bar */}
      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search talents..."
            className="pl-8 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email Status</TableHead>
              <TableHead>Profile Status</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTalents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No talents found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTalents.map((talent) => {
                const isProfileVerified =
                  talent.talentProfile?.isVerified || false;
                return (
                  <TableRow
                    key={talent.id}
                    className={talent.isSuspended ? "bg-red-50/50" : ""}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={talent.image || ""} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-slate-900">
                            {talent.name || "No Name"}
                            {talent.isSuspended && (
                              <Badge
                                variant="destructive"
                                className="h-5 text-[10px] px-1.5"
                              >
                                BANNED
                              </Badge>
                            )}
                          </span>
                          <span className="text-xs text-slate-500">
                            {talent.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          talent.emailVerified
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                        }
                      >
                        {talent.emailVerified ? "Verified" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          isProfileVerified
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-100 border-0"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-100 border-0"
                        }
                      >
                        {isProfileVerified ? "Verified Talent" : "Not Verified"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {format(new Date(talent.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              onVerifyToggle(talent.id, isProfileVerified)
                            }
                          >
                            {isProfileVerified ? (
                              <>
                                <ShieldAlert className="h-4 w-4" /> Revoke
                                Verification
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="h-4 w-4 text-blue-600" />{" "}
                                Verify Profile
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            View Activity Logs
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              onSuspendToggle(talent.id, talent.isSuspended)
                            }
                            className={
                              talent.isSuspended
                                ? "text-green-600 focus:text-green-600"
                                : "text-red-600 focus:text-red-600"
                            }
                          >
                            {talent.isSuspended ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />{" "}
                                Activate Account
                              </>
                            ) : (
                              <>
                                <Ban className="mr-2 h-4 w-4" /> Suspend Account
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
