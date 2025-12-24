"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, X } from "lucide-react";
import { useState, useEffect } from "react";

const CATEGORIES = [
  "Actor",
  "Model",
  "Dancer",
  "Musician",
  "Voice Over",
  "Crew",
];
const PROJECT_TYPES = ["FILM", "TV", "COMMERCIAL", "EVENT", "THEATER"];

export const JobFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [minSalary, setMinSalary] = useState(
    Number(searchParams.get("minSalary")) || 0
  );

  useEffect(() => {
    const urlLocation = searchParams.get("location") || "";
    const urlSalary = Number(searchParams.get("minSalary")) || 0;

    if (urlLocation !== location) {
      setLocation(urlLocation);
    }
    if (urlSalary !== minSalary) {
      setMinSalary(urlSalary);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", "1");
    router.push(`/jobs?${params.toString()}`);
  };

  const clearFilters = () => {
    setLocation("");
    setMinSalary(0);
    router.push("/jobs");
  };

  return (
    <Card className="sticky top-24 h-fit border-none shadow-none md:border md:shadow-sm">
      <CardHeader className="pb-4 px-0 md:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 font-semibold text-slate-900">
            <Filter className="h-4 w-4 text-[#1E40AF]" /> Filters
          </CardTitle>
          {searchParams.toString().length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Reset <X className="ml-1 h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-0 md:px-6">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Sort By
          </Label>
          <Select
            value={searchParams.get("sort") || "newest"}
            onValueChange={(val) => updateFilter("sort", val)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="salary-high">Highest Pay</SelectItem>
              <SelectItem value="salary-low">Lowest Pay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Category
          </Label>
          <Select
            value={searchParams.get("category") || "all"}
            onValueChange={(val) =>
              updateFilter("category", val === "all" ? null : val)
            }
          >
            <SelectTrigger className="bg-white">
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

        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Project Type
          </Label>
          <Select
            value={searchParams.get("type") || "all"}
            onValueChange={(val) =>
              updateFilter("type", val === "all" ? null : val)
            }
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {PROJECT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Location
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Lagos"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && updateFilter("location", location)
              }
              className="bg-white"
            />
            <Button
              variant="outline"
              size="icon"
              className="bg-white shrink-0"
              onClick={() => updateFilter("location", location)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Min Salary
            </Label>
            <span className="text-xs text-[#1E40AF] font-medium bg-blue-50 px-2 py-1 rounded">
              {minSalary > 0 ? `₦${minSalary.toLocaleString()}+` : "Any"}
            </span>
          </div>
          <Slider
            defaultValue={[0]}
            max={500000}
            step={5000}
            value={[minSalary]}
            onValueChange={(vals) => setMinSalary(vals[0])}
            onValueCommit={(vals) =>
              updateFilter(
                "minSalary",
                vals[0] === 0 ? null : vals[0].toString()
              )
            }
            className="py-4"
          />
        </div>
      </CardContent>
    </Card>
  );
};
