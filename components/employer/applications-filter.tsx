"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const STATUS_OPTIONS = [
  "SUBMITTED",
  "REVIEWING",
  "SHORTLISTED",
  "INTERVIEW",
  "HIRED",
  "REJECTED",
];

export const ApplicationsFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/employer/applications?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    router.push("/employer/applications");
  };

  const hasActiveFilters = searchParams.toString().length > 0;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
          <Input
            placeholder="Search by candidate name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && updateFilter("search", search)
            }
            className="pl-11 h-11 border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white focus:border-[#1E40AF] transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-[220px]">
          <Select
            value={searchParams.get("status") || "ALL"}
            onValueChange={(val) =>
              updateFilter("status", val === "ALL" ? null : val)
            }
          >
            <SelectTrigger className="bg-[#F9FAFB] border-[#E5E7EB] h-11 focus:border-[#1E40AF] focus:ring-[#1E40AF]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#6B7280]" />
                <SelectValue placeholder="All Status" />
              </div>
            </SelectTrigger>
            <SelectContent className="border-[#E5E7EB] rounded-xl">
              <SelectItem value="ALL" className="cursor-pointer">
                All Status
              </SelectItem>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                  className="cursor-pointer"
                >
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-colors h-11 px-4 rounded-lg"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#6B7280]">
              Active Filters:
            </span>
            {search && (
              <Badge
                variant="outline"
                className="bg-[#1E40AF]/5 border-[#1E40AF]/20 text-[#1E40AF] font-medium rounded-full px-3 py-1"
              >
                Search: {search}
              </Badge>
            )}
            {searchParams.get("status") && (
              <Badge
                variant="outline"
                className="bg-[#1E40AF]/5 border-[#1E40AF]/20 text-[#1E40AF] font-medium rounded-full px-3 py-1"
              >
                Status: {searchParams.get("status")}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
