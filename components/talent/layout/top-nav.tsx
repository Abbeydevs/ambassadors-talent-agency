/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import { Bell, MessageSquare, Search, Menu } from "lucide-react";
import { useState } from "react";

export const TopNav = () => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="bg-white border-b h-20 px-6 md:px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      <div
        className={cn(
          "hidden md:flex items-center bg-gray-50 rounded-xl px-4 py-3 w-full max-w-xl transition-all",
          searchFocused ? "ring-2 ring-[#1E40AF]/20 bg-white shadow-sm" : ""
        )}
      >
        <Search
          className={cn(
            "h-5 w-5 mr-3 transition-colors",
            searchFocused ? "text-[#1E40AF]" : "text-gray-400"
          )}
        />
        <input
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400 text-gray-900"
          placeholder="Search for jobs, talent, or courses..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-5 w-5 text-gray-600" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100 transition-colors"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100 transition-colors"
        >
          <MessageSquare className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 h-5 w-5 bg-linear-to-br from-[#EF4444] to-[#DC2626] rounded-full text-[10px] text-white flex items-center justify-center font-bold ring-2 ring-white">
            2
          </span>
        </Button>

        <div className="h-8 w-px bg-gray-200 mx-2"></div>

        <div className="flex items-center gap-3">
          <UserButton />
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-gray-900">John Doe</p>
            <p className="text-xs text-gray-500">Talent</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
