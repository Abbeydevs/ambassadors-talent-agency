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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CalendarIcon, MapPin, Clapperboard, Clock, Info } from "lucide-react";
import { format, differenceInDays } from "date-fns";

const PROJECT_TYPES = [
  { value: "FILM", label: "Film (Feature/Short)", icon: "🎬" },
  { value: "TV", label: "TV Series", icon: "📺" },
  { value: "COMMERCIAL", label: "Commercial", icon: "📢" },
  { value: "EVENT", label: "Live Event", icon: "🎭" },
  { value: "THEATER", label: "Theater", icon: "🎪" },
  { value: "MUSIC_VIDEO", label: "Music Video", icon: "🎵" },
  { value: "WEB_SERIES", label: "Web Series", icon: "💻" },
  { value: "DOCUMENTARY", label: "Documentary", icon: "🎥" },
];

interface JobProjectDetailsProps {
  form: UseFormReturn<any>;
}

export const JobProjectDetails = ({ form }: JobProjectDetailsProps) => {
  const startDate = form.watch("startDate");
  const daysUntilStart = startDate
    ? differenceInDays(new Date(startDate), new Date())
    : null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header Section */}
      <div className="flex items-start gap-3 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
        <div className="p-2 bg-[#1E40AF]/10 rounded-lg">
          <Clapperboard className="h-5 w-5 text-[#1E40AF]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#111827] mb-1">
            Project logistics and timeline
          </h3>
          <p className="text-sm text-[#6B7280]">
            Provide information about where and when the project will take
            place. This helps candidates plan their availability.
          </p>
        </div>
      </div>

      {/* Location */}
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#111827] font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#1E40AF]" />
              Location
              <Badge
                variant="outline"
                className="ml-auto text-xs border-[#F59E0B] text-[#F59E0B]"
              >
                Required
              </Badge>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. Lagos, Nigeria • Abuja, Nigeria • Remote • Multiple Locations"
                className="border-[#E5E7EB] focus:border-[#1E40AF] focus:ring-[#1E40AF] text-[#111827]"
                {...field}
              />
            </FormControl>
            <FormDescription className="text-[#6B7280]">
              Be specific about the city and country. Mention if remote work or
              travel is involved.
            </FormDescription>
            <FormMessage className="text-[#EF4444]" />
          </FormItem>
        )}
      />

      {/* Project Type and Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="projectType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#111827] font-semibold flex items-center gap-2">
                <Clapperboard className="h-4 w-4 text-[#1E40AF]" />
                Project Type
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
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PROJECT_TYPES.map((type) => (
                    <SelectItem
                      key={type.value}
                      value={type.value}
                      className="focus:bg-[#1E40AF]/10 focus:text-[#1E40AF]"
                    >
                      <span className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-[#6B7280]">
                Select the type of production
              </FormDescription>
              <FormMessage className="text-[#EF4444]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#111827] font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#1E40AF]" />
                Duration
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. 3 days, 2 weeks, 6 months"
                  className="border-[#E5E7EB] focus:border-[#1E40AF] focus:ring-[#1E40AF] text-[#111827]"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription className="text-[#6B7280]">
                How long will the project or engagement last?
              </FormDescription>
              <FormMessage className="text-[#EF4444]" />
            </FormItem>
          )}
        />
      </div>

      {/* Start Date */}
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-[#111827] font-semibold flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-[#1E40AF]" />
              Start Date
              {startDate && daysUntilStart !== null && (
                <Badge
                  className={cn(
                    "ml-auto",
                    daysUntilStart < 7
                      ? "bg-[#F59E0B] text-white"
                      : daysUntilStart < 30
                      ? "bg-[#3B82F6] text-white"
                      : "bg-[#10B981] text-white"
                  )}
                >
                  {daysUntilStart === 0
                    ? "Starting today"
                    : daysUntilStart === 1
                    ? "Starting tomorrow"
                    : daysUntilStart < 0
                    ? "Past date"
                    : `${daysUntilStart} days away`}
                </Badge>
              )}
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#1E40AF]",
                      !field.value && "text-[#9CA3AF]",
                      field.value && "text-[#111827]"
                    )}
                  >
                    {field.value ? (
                      <span className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-[#1E40AF]" />
                        {format(field.value, "EEEE, MMMM d, yyyy")}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-[#9CA3AF]" />
                        Select start date
                      </span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value || undefined}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="rounded-md border border-[#E5E7EB]"
                />
              </PopoverContent>
            </Popover>
            <FormDescription className="text-[#6B7280]">
              When does the project begin? Select a future date or leave blank
              if TBD.
            </FormDescription>
            <FormMessage className="text-[#EF4444]" />
          </FormItem>
        )}
      />

      {/* Timeline Summary */}
      {(startDate || form.watch("duration")) && (
        <div className="p-4 bg-[#1E40AF]/5 border border-[#1E40AF]/20 rounded-lg">
          <h4 className="text-sm font-semibold text-[#111827] mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-[#1E40AF]" />
            Project Timeline Summary
          </h4>
          <div className="space-y-2 text-sm">
            {startDate && (
              <div className="flex items-start gap-2">
                <CalendarIcon className="h-4 w-4 text-[#1E40AF] mt-0.5" />
                <div>
                  <span className="font-medium text-[#111827]">
                    Start Date:{" "}
                  </span>
                  <span className="text-[#6B7280]">
                    {format(startDate, "MMMM d, yyyy")}
                  </span>
                  {daysUntilStart !== null && daysUntilStart > 0 && (
                    <span className="text-[#6B7280]">
                      {" "}
                      ({daysUntilStart} days from now)
                    </span>
                  )}
                </div>
              </div>
            )}
            {form.watch("duration") && (
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-[#1E40AF] mt-0.5" />
                <div>
                  <span className="font-medium text-[#111827]">Duration: </span>
                  <span className="text-[#6B7280]">
                    {form.watch("duration")}
                  </span>
                </div>
              </div>
            )}
            {form.watch("location") && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#1E40AF] mt-0.5" />
                <div>
                  <span className="font-medium text-[#111827]">Location: </span>
                  <span className="text-[#6B7280]">
                    {form.watch("location")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="p-4 bg-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-lg">
        <h4 className="text-sm font-semibold text-[#111827] mb-2 flex items-center gap-2">
          <span className="text-[#3B82F6]">💡</span>
          Tips for Project Details
        </h4>
        <ul className="space-y-1 text-sm text-[#6B7280]">
          <li className="flex items-start gap-2">
            <span className="text-[#10B981] mt-0.5">✓</span>
            <span>Specify if the project requires travel or relocation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#10B981] mt-0.5">✓</span>
            <span>
              Mention if accommodation or transportation will be provided
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#10B981] mt-0.5">✓</span>
            <span>
              Include shooting schedule details (e.g., &quot;weekends
              only&quot;, &quot;night shoots&quot;)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#10B981] mt-0.5">✓</span>
            <span>
              Be clear about the expected time commitment per day or week
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
