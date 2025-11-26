/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Users,
  Calendar,
  UserCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const SKILL_OPTIONS = [
  { label: "Improvisation", value: "Improvisation" },
  { label: "Singing", value: "Singing" },
  { label: "Stunt Work", value: "Stunt Work" },
  { label: "Dancing", value: "Dancing" },
  { label: "Driving", value: "Driving" },
  { label: "Swimming", value: "Swimming" },
  { label: "Horse Riding", value: "Horse Riding" },
  { label: "Stage Combat", value: "Stage Combat" },
  { label: "Martial Arts", value: "Martial Arts" },
  { label: "Musical Instrument", value: "Musical Instrument" },
  { label: "Languages", value: "Languages" },
  { label: "Accents", value: "Accents" },
];

interface JobRequirementsProps {
  form: UseFormReturn<any>;
}

export const JobRequirements = ({ form }: JobRequirementsProps) => {
  const roleDescriptionLength = form.watch("roleDescription")?.length || 0;
  const selectedSkills = form.watch("skills") || [];
  const minAge = form.watch("minAge");
  const maxAge = form.watch("maxAge");
  const MAX_ROLE_DESC_LENGTH = 1000;

  const ageRangeValid = !minAge || !maxAge || minAge <= maxAge;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header Section */}
      <div className="flex items-start gap-3 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
        <div className="p-2 bg-[#1E40AF]/10 rounded-lg">
          <Star className="h-5 w-5 text-[#1E40AF]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#111827] mb-1">
            Define your ideal candidate
          </h3>
          <p className="text-sm text-[#6B7280]">
            Specify the skills, experience, and characteristics you&apos;re
            looking for. Be as detailed as possible to attract qualified
            applicants.
          </p>
        </div>
      </div>

      {/* Role Description */}
      <FormField
        control={form.control}
        name="roleDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#111827] font-semibold flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-[#1E40AF]" />
              Specific Role Requirements
              <Badge
                variant="outline"
                className="ml-auto text-xs border-[#F59E0B] text-[#F59E0B]"
              >
                Required
              </Badge>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Textarea
                  className="min-h-[120px] border-[#E5E7EB] focus:border-[#1E40AF] focus:ring-[#1E40AF] text-[#111827] resize-none"
                  placeholder="Describe the specific requirements for this role:&#10;• Character type and personality&#10;• Physical requirements or appearance&#10;• Experience level needed&#10;• Any specific performance requirements&#10;• Special skills or training required"
                  maxLength={MAX_ROLE_DESC_LENGTH}
                  {...field}
                  value={field.value || ""}
                />
                <span className="absolute bottom-3 right-3 text-xs text-[#9CA3AF]">
                  {roleDescriptionLength}/{MAX_ROLE_DESC_LENGTH}
                </span>
              </div>
            </FormControl>
            <FormDescription className="text-[#6B7280]">
              Provide details about the character, performance style, or
              specific duties
            </FormDescription>
            <FormMessage className="text-[#EF4444]" />
          </FormItem>
        )}
      />

      {/* Required Skills */}
      <FormField
        control={form.control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#111827] font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#1E40AF]" />
              Required Skills
              {selectedSkills.length > 0 && (
                <Badge className="ml-2 bg-[#1E40AF] text-white">
                  {selectedSkills.length} selected
                </Badge>
              )}
            </FormLabel>
            <FormControl>
              <MultiSelect
                selected={field.value || []}
                options={SKILL_OPTIONS}
                onChange={field.onChange}
                placeholder="Select required skills..."
                className="border-[#E5E7EB] focus:border-[#1E40AF]"
              />
            </FormControl>
            <FormDescription className="text-[#6B7280]">
              Select all skills that are essential for this role. Leave empty if
              no specific skills are required.
            </FormDescription>
            <FormMessage className="text-[#EF4444]" />
          </FormItem>
        )}
      />

      {/* Demographic Requirements Section */}
      <div className="space-y-6 p-6 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-[#F59E0B] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-[#111827] mb-1">
              Demographic Requirements
            </h4>
            <p className="text-xs text-[#6B7280]">
              Only specify these if they are essential to the role. Consider
              inclusivity when setting requirements.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#111827] font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#6B7280]" />
                  Gender Preference
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || "ANY"}
                >
                  <FormControl>
                    <SelectTrigger className="border-[#E5E7EB] focus:border-[#1E40AF] focus:ring-[#1E40AF] text-[#111827]">
                      <SelectValue placeholder="Select gender preference" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      value="ANY"
                      className="focus:bg-[#1E40AF]/10 focus:text-[#1E40AF]"
                    >
                      <span className="flex items-center gap-2">
                        <span>✨</span>
                        <span>Any Gender</span>
                      </span>
                    </SelectItem>
                    <SelectItem
                      value="MALE"
                      className="focus:bg-[#1E40AF]/10 focus:text-[#1E40AF]"
                    >
                      <span className="flex items-center gap-2">
                        <span>👨</span>
                        <span>Male</span>
                      </span>
                    </SelectItem>
                    <SelectItem
                      value="FEMALE"
                      className="focus:bg-[#1E40AF]/10 focus:text-[#1E40AF]"
                    >
                      <span className="flex items-center gap-2">
                        <span>👩</span>
                        <span>Female</span>
                      </span>
                    </SelectItem>
                    <SelectItem
                      value="NON_BINARY"
                      className="focus:bg-[#1E40AF]/10 focus:text-[#1E40AF]"
                    >
                      <span className="flex items-center gap-2">
                        <span>⚧</span>
                        <span>Non-Binary</span>
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-[#6B7280] text-xs">
                  Default is &quot;Any&quot; - only specify if essential to the
                  role
                </FormDescription>
                <FormMessage className="text-[#EF4444]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ethnicity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#111827] font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#6B7280]" />
                  Ethnicity Preference
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || "ANY"}
                >
                  <FormControl>
                    <SelectTrigger className="border-[#E5E7EB] focus:border-[#1E40AF] focus:ring-[#1E40AF] text-[#111827]">
                      <SelectValue placeholder="Select ethnicity preference" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      value="ANY"
                      className="focus:bg-[#1E40AF]/10 focus:text-[#1E40AF]"
                    >
                      <span className="flex items-center gap-2">
                        <span>🌍</span>
                        <span>Any Ethnicity</span>
                      </span>
                    </SelectItem>
                    <SelectItem
                      value="AFRICAN"
                      className="focus:bg-[#1E40AF]/10 focus:text-[#1E40AF]"
                    >
                      <span className="flex items-center gap-2">
                        <span>🌍</span>
                        <span>African</span>
                      </span>
                    </SelectItem>
                    <SelectItem
                      value="CAUCASIAN"
                      className="focus:bg-[#1E40AF]/10 focus:text-[#1E40AF]"
                    >
                      <span className="flex items-center gap-2">
                        <span>🌍</span>
                        <span>Caucasian</span>
                      </span>
                    </SelectItem>
                    <SelectItem
                      value="ASIAN"
                      className="focus:bg-[#1E40AF]/10 focus:text-[#1E40AF]"
                    >
                      <span className="flex items-center gap-2">
                        <span>🌏</span>
                        <span>Asian</span>
                      </span>
                    </SelectItem>
                    <SelectItem
                      value="HISPANIC"
                      className="focus:bg-[#1E40AF]/10 focus:text-[#1E40AF]"
                    >
                      <span className="flex items-center gap-2">
                        <span>🌎</span>
                        <span>Hispanic/Latino</span>
                      </span>
                    </SelectItem>
                    <SelectItem
                      value="MIDDLE_EASTERN"
                      className="focus:bg-[#1E40AF]/10 focus:text-[#1E40AF]"
                    >
                      <span className="flex items-center gap-2">
                        <span>🌍</span>
                        <span>Middle Eastern</span>
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-[#6B7280] text-xs">
                  Default is &quot;An&quot; - only specify if essential to the
                  role
                </FormDescription>
                <FormMessage className="text-[#EF4444]" />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Age Range */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#1E40AF]" />
          <h4 className="text-sm font-semibold text-[#111827]">Age Range</h4>
          {minAge && maxAge && (
            <Badge
              variant="outline"
              className={`ml-auto ${
                ageRangeValid
                  ? "border-[#10B981] text-[#10B981]"
                  : "border-[#EF4444] text-[#EF4444]"
              }`}
            >
              {ageRangeValid ? `${minAge} - ${maxAge} years` : "Invalid range"}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="minAge"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#111827] font-medium">
                  Minimum Age
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="18"
                      className={`border-[#E5E7EB] focus:border-[#1E40AF] focus:ring-[#1E40AF] text-[#111827] pr-16 ${
                        !ageRangeValid
                          ? "border-[#EF4444] focus:border-[#EF4444]"
                          : ""
                      }`}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF]">
                      years old
                    </span>
                  </div>
                </FormControl>
                <FormDescription className="text-[#6B7280] text-xs">
                  Minimum age requirement for applicants
                </FormDescription>
                <FormMessage className="text-[#EF4444]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxAge"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#111827] font-medium">
                  Maximum Age
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="60"
                      className={`border-[#E5E7EB] focus:border-[#1E40AF] focus:ring-[#1E40AF] text-[#111827] pr-16 ${
                        !ageRangeValid
                          ? "border-[#EF4444] focus:border-[#EF4444]"
                          : ""
                      }`}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF]">
                      years old
                    </span>
                  </div>
                </FormControl>
                <FormDescription className="text-[#6B7280] text-xs">
                  Maximum age requirement for applicants
                </FormDescription>
                <FormMessage className="text-[#EF4444]" />
              </FormItem>
            )}
          />
        </div>

        {!ageRangeValid && minAge && maxAge && (
          <div className="flex items-start gap-2 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-[#EF4444] shrink-0 mt-0.5" />
            <p className="text-sm text-[#EF4444]">
              Maximum age must be greater than or equal to minimum age
            </p>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="p-4 bg-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-lg">
        <h4 className="text-sm font-semibold text-[#111827] mb-2 flex items-center gap-2">
          <span className="text-[#3B82F6]">💡</span>
          Best Practices for Setting Requirements
        </h4>
        <ul className="space-y-1 text-sm text-[#6B7280]">
          <li className="flex items-start gap-2">
            <span className="text-[#10B981] mt-0.5">✓</span>
            <span>
              Be specific about required skills that are truly necessary for the
              role
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#10B981] mt-0.5">✓</span>
            <span>
              Only set demographic requirements if they&apos;re essential to the
              character or production
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#10B981] mt-0.5">✓</span>
            <span>
              Consider being flexible with age ranges to discover unexpected
              talent
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#10B981] mt-0.5">✓</span>
            <span>
              Remember that overly restrictive requirements may limit your
              applicant pool
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
