"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, X } from "lucide-react";

const CATEGORIES = [
  "Audition",
  "Workshop",
  "Networking",
  "Performance",
  "Webinar",
  "Competition",
];

export const EventFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Initialize State
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [dateFilter, setDateFilter] = useState(
    searchParams.get("date") || "upcoming"
  );

  // 2. Sync State with URL
  useEffect(() => {
    const urlLocation = searchParams.get("location") || "";
    const urlDate = searchParams.get("date") || "upcoming";

    if (urlLocation !== location) setLocation(urlLocation);
    if (urlDate !== dateFilter) setDateFilter(urlDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/events?${params.toString()}`);
  };

  const clearFilters = () => {
    setLocation("");
    setDateFilter("upcoming");
    router.push("/events");
  };

  return (
    <Card className="sticky top-24 border-none shadow-none md:border md:shadow-sm h-fit">
      <CardHeader className="px-0 md:px-6 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" /> Filters
          </CardTitle>
          {searchParams.toString().length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Reset <X className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 px-0 md:px-6">
        {/* Category Filter */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase">
            Category
          </Label>
          <Select
            value={searchParams.get("category") || "all"}
            onValueChange={(val) =>
              updateFilter("category", val === "all" ? null : val)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Filter */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase">
            Date
          </Label>
          <Select
            value={dateFilter}
            onValueChange={(val) => updateFilter("date", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="When?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Any Upcoming Date</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase">
            Location
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="City or Venue"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && updateFilter("location", location)
              }
            />
            <Button
              size="icon"
              variant="outline"
              onClick={() => updateFilter("location", location)}
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
