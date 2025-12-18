"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Search } from "lucide-react";
import { useState } from "react";

// Common skills to suggest (You can fetch these from DB later if you want)
const COMMON_SKILLS = [
  "React",
  "Node.js",
  "Acting",
  "Voiceover",
  "Modeling",
  "Singing",
  "Dance",
  "Photography",
];

export const TalentFilterSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for inputs
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [skillInput, setSkillInput] = useState("");

  // Get current skills from URL (comma separated)
  const currentSkills = searchParams.get("skills")
    ? searchParams.get("skills")!.split(",")
    : [];

  const updateFilters = (newLocation: string, newSkills: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update Location
    if (newLocation) params.set("location", newLocation);
    else params.delete("location");

    // Update Skills
    if (newSkills.length > 0) params.set("skills", newSkills.join(","));
    else params.delete("skills");

    router.push(`/employer/search?${params.toString()}`);
  };

  const handleLocationSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") updateFilters(location, currentSkills);
  };

  const addSkill = (skill: string) => {
    if (!currentSkills.includes(skill)) {
      updateFilters(location, [...currentSkills, skill]);
    }
    setSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = currentSkills.filter((s) => s !== skillToRemove);
    updateFilters(location, newSkills);
  };

  const clearAll = () => {
    setLocation("");
    router.push("/employer/search");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        {(location || currentSkills.length > 0) && (
          <Button
            variant="link"
            onClick={clearAll}
            className="text-red-500 h-auto p-0 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* LOCATION FILTER */}
      <div className="space-y-2">
        <Label>Location</Label>
        <div className="relative">
          <Input
            placeholder="City or Country..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleLocationSubmit}
          />
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-1 top-1 h-7 w-7 p-0 text-slate-400"
            onClick={() => updateFilters(location, currentSkills)}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* SKILLS FILTER */}
      <div className="space-y-2">
        <Label>Skills & Categories</Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {currentSkills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              {skill}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeSkill(skill)}
              />
            </Badge>
          ))}
        </div>

        <Input
          placeholder="Add a skill (e.g. Acting)..."
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && skillInput) addSkill(skillInput);
          }}
        />

        <div className="flex flex-wrap gap-1.5 mt-2">
          {COMMON_SKILLS.filter((s) => !currentSkills.includes(s)).map(
            (skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="cursor-pointer hover:bg-slate-100 font-normal text-xs"
                onClick={() => addSkill(skill)}
              >
                + {skill}
              </Badge>
            )
          )}
        </div>
      </div>
    </div>
  );
};
