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

  return (
    <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg border shadow-sm mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by candidate name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && updateFilter("search", search)}
          className="pl-10 border-0 bg-slate-50"
        />
      </div>

      <div className="w-full md:w-[200px]">
        <Select
          value={searchParams.get("status") || "ALL"}
          onValueChange={(val) =>
            updateFilter("status", val === "ALL" ? null : val)
          }
        >
          <SelectTrigger className="bg-slate-50 border-0">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <SelectValue placeholder="All Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {searchParams.toString().length > 0 && (
        <Button
          variant="ghost"
          onClick={clearFilters}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          Reset <X className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
