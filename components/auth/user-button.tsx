"use client";

import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";
import { VerificationBadge } from "../ui/verification-badge";

interface UserButtonProps {
  isVerified?: boolean;
}

export const UserButton = ({ isVerified = false }: UserButtonProps) => {
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none group">
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar className="h-9 w-9 border border-slate-200 transition group-hover:border-[#1E40AF]">
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback className="bg-[#1E40AF] text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-slate-500 transition duration-200 group-data-[state=open]:rotate-180" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end">
        {/* User Info Header */}
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user?.name && (
              <div className="flex items-center gap-1.5">
                <p className="font-medium text-sm text-slate-900">
                  {user.name}
                </p>
                {isVerified && <VerificationBadge />}
              </div>
            )}
            {user?.email && (
              <p className="w-[200px] truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            )}
            {/* Role Badge */}
            <div className="pt-1">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 capitalize">
                {user?.role?.toLowerCase() || "User"}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Links */}
        <DropdownMenuItem asChild>
          <Link
            href="/talent/settings"
            className="cursor-pointer flex items-center py-2"
          >
            <Settings className="h-4 w-4 mr-2" />
            Account Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => logout()}
          className="cursor-pointer flex items-center py-2 text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
