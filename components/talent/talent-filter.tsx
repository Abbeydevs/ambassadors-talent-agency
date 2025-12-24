"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
  "Actor",
  "Model",
  "Dancer",
  "Musician",
  "Comedian",
  "Presenter",
  "Voice Over Artist",
  "Influencer",
];

export const TalentFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [ageRange, setAgeRange] = useState([
    Number(searchParams.get("minAge")) || 18,
    Number(searchParams.get("maxAge")) || 60,
  ]);

  useEffect(() => {
    const urlLocation = searchParams.get("location") || "";
    const urlMin = Number(searchParams.get("minAge")) || 18;
    const urlMax = Number(searchParams.get("maxAge")) || 60;

    if (urlLocation !== location) {
      setLocation(urlLocation);
    }

    if (urlMin !== ageRange[0] || urlMax !== ageRange[1]) {
      setAgeRange([urlMin, urlMax]);
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

    params.set("page", "1"); // Reset page
    router.push(`/talents?${params.toString()}`);
  };

  const handleAgeChange = (value: number[]) => {
    setAgeRange(value);
  };

  const commitAgeChange = (value: number[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minAge", value[0].toString());
    params.set("maxAge", value[1].toString());
    params.set("page", "1");
    router.push(`/talents?${params.toString()}`);
  };

  const clearFilters = () => {
    setLocation("");
    setAgeRange([18, 60]);
    router.push("/talents");
  };

  return (
    <Card className="sticky top-24 border-none shadow-none md:border md:shadow-sm h-fit">
      <CardHeader className="px-0 md:px-6 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#1E40AF]" /> Filters
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

        {/* Location Filter */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase">
            Location
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="City or Country"
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

        {/* Gender Filter */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase">
            Gender
          </Label>
          <Select
            value={searchParams.get("gender") || "all"}
            onValueChange={(val) =>
              updateFilter("gender", val === "all" ? null : val)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Any Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Gender</SelectItem>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Age Range
            </Label>
            <span className="text-xs text-[#1E40AF] font-medium bg-blue-50 px-2 py-1 rounded">
              {ageRange[0]} - {ageRange[1]} yrs
            </span>
          </div>
          <Slider
            defaultValue={[18, 60]}
            max={80}
            min={0}
            step={1}
            value={ageRange}
            onValueChange={handleAgeChange}
            onValueCommit={commitAgeChange}
            className="py-4"
          />
        </div>
      </CardContent>
    </Card>
  );
};
