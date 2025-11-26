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
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, FileText, Sparkles } from "lucide-react";

const CATEGORY_OPTIONS = [
  { label: "Actor", value: "Actor", icon: "🎭" },
  { label: "Model", value: "Model", icon: "📸" },
  { label: "Dancer", value: "Dancer", icon: "💃" },
  { label: "Musician", value: "Musician", icon: "🎵" },
  { label: "Voice Over", value: "Voice Over", icon: "🎤" },
  { label: "Crew", value: "Crew", icon: "🎬" },
];

interface JobBasicInfoProps {
  form: UseFormReturn<any>;
}

export const JobBasicInfo = ({ form }: JobBasicInfoProps) => {
  const descriptionLength = form.watch("description")?.length || 0;
  const titleLength = form.watch("title")?.length || 0;
  const MIN_DESCRIPTION_LENGTH = 100;
  const MAX_DESCRIPTION_LENGTH = 2000;
  const MAX_TITLE_LENGTH = 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-start gap-3 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
        <div className="p-2 bg-[#1E40AF]/10 rounded-lg">
          <Sparkles className="h-5 w-5 text-[#1E40AF]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#111827] mb-1">
            Start with the basics
          </h3>
          <p className="text-sm text-[#6B7280]">
            Provide essential information about the job position. A clear title
            and detailed description help attract the right talent.
          </p>
        </div>
      </div>

      {/* Job Title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#111827] font-semibold flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-[#1E40AF]" />
              Job Title
              <Badge
                variant="outline"
                className="ml-auto text-xs border-[#F59E0B] text-[#F59E0B]"
              >
                Required
              </Badge>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  placeholder="e.g. Lead Actor for TV Commercial, Fashion Model for Summer Campaign"
                  className="border-[#E5E7EB] focus:border-[#1E40AF] focus:ring-[#1E40AF] text-[#111827] pr-16"
                  maxLength={MAX_TITLE_LENGTH}
                  {...field}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF]">
                  {titleLength}/{MAX_TITLE_LENGTH}
                </span>
              </div>
            </FormControl>
            <FormDescription className="text-[#6B7280]">
              Make it specific and compelling to attract qualified candidates
            </FormDescription>
            <FormMessage className="text-[#EF4444]" />
          </FormItem>
        )}
      />

      {/* Category and Positions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#111827] font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#1E40AF]" />
                Category
                <Badge
                  variant="outline"
                  className="ml-auto text-xs border-[#F59E0B] text-[#F59E0B]"
                >
                  Required
                </Badge>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-[#E5E7EB] focus:border-[#1E40AF] focus:ring-[#1E40AF] text-[#111827]">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="focus:bg-[#1E40AF]/10 focus:text-[#1E40AF]"
                    >
                      <span className="flex items-center gap-2">
                        <span>{opt.icon}</span>
                        <span>{opt.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-[#6B7280]">
                Choose the primary role type
              </FormDescription>
              <FormMessage className="text-[#EF4444]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="positions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#111827] font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-[#1E40AF]" />
                Number of Positions
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    className="border-[#E5E7EB] focus:border-[#1E40AF] focus:ring-[#1E40AF] text-[#111827]"
                    placeholder="1"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF]">
                    {field.value > 1 ? "openings" : "opening"}
                  </div>
                </div>
              </FormControl>
              <FormDescription className="text-[#6B7280]">
                How many people are you hiring?
              </FormDescription>
              <FormMessage className="text-[#EF4444]" />
            </FormItem>
          )}
        />
      </div>

      {/* Job Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#111827] font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#1E40AF]" />
              Job Description
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
                  className="min-h-40 border-[#E5E7EB] focus:border-[#1E40AF] focus:ring-[#1E40AF] text-[#111827] resize-none"
                  placeholder="Provide a detailed description of the role, project, and what makes this opportunity unique. Include information about:&#10;• Project overview and storyline&#10;• Character or role details&#10;• Production schedule and timeline&#10;• Working environment&#10;• Any special requirements"
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  {...field}
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  {descriptionLength < MIN_DESCRIPTION_LENGTH &&
                    descriptionLength > 0 && (
                      <span className="text-xs text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-1 rounded">
                        {MIN_DESCRIPTION_LENGTH - descriptionLength} more
                        characters needed
                      </span>
                    )}
                  <span
                    className={`text-xs ${
                      descriptionLength >= MIN_DESCRIPTION_LENGTH
                        ? "text-[#10B981]"
                        : "text-[#9CA3AF]"
                    }`}
                  >
                    {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
                  </span>
                </div>
              </div>
            </FormControl>
            <FormDescription className="text-[#6B7280]">
              Minimum {MIN_DESCRIPTION_LENGTH} characters. Be specific and
              engaging to attract the best candidates.
            </FormDescription>
            <FormMessage className="text-[#EF4444]" />
          </FormItem>
        )}
      />

      {/* Tips Section */}
      <div className="p-4 bg-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-lg">
        <h4 className="text-sm font-semibold text-[#111827] mb-2 flex items-center gap-2">
          <span className="text-[#3B82F6]">💡</span>
          Pro Tips for Writing Great Job Descriptions
        </h4>
        <ul className="space-y-1 text-sm text-[#6B7280]">
          <li className="flex items-start gap-2">
            <span className="text-[#10B981] mt-0.5">✓</span>
            <span>
              Be clear about the project type (film, commercial, theater, etc.)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#10B981] mt-0.5">✓</span>
            <span>Mention the production company or director if notable</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#10B981] mt-0.5">✓</span>
            <span>Include shooting dates and location details</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#10B981] mt-0.5">✓</span>
            <span>
              Highlight unique aspects that make this opportunity exciting
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
