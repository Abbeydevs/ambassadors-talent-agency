/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { UseFormReturn, useWatch } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  CheckCircle2,
  Briefcase,
  MapPin,
  DollarSign,
  FolderOpen,
  Eye,
  FileCheck,
} from "lucide-react";

interface JobReviewProps {
  form: UseFormReturn<any>;
}

export const JobReview = ({ form }: JobReviewProps) => {
  const watchedValues = useWatch({ control: form.control });
  const {
    isPaid,
    title,
    projectType,
    location,
    salaryMin,
    salaryMax,
    category,
    positions,
    description,
    deadline,
    currency = "USD",
  } = watchedValues;

  const isComplete = title && category && description;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-start gap-3 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
        <div className="p-2 bg-[#1E40AF]/10 rounded-lg">
          <Sparkles className="h-5 w-5 text-[#1E40AF]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#111827] mb-1">
            Review & Publish
          </h3>
          <p className="text-sm text-[#6B7280]">
            Review your job posting details before publishing. You can save as
            draft or publish immediately.
          </p>
        </div>
      </div>

      {isComplete && (
        <div className="flex items-center gap-2 p-3 bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
          <span className="text-sm font-medium text-[#059669]">
            All required fields completed
          </span>
        </div>
      )}

      <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
        <div className="bg-linear-to-r from-[#1E40AF] to-[#3B82F6] p-4">
          <h3 className="font-semibold text-lg text-white flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Job Summary
          </h3>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="h-4 w-4 text-[#6B7280]" />
                  <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">
                    Job Title
                  </span>
                </div>
                <p className="font-semibold text-[#111827] text-lg">
                  {title || "No title provided"}
                </p>
              </div>
              {category && (
                <Badge className="bg-[#1E40AF] text-white hover:bg-[#1E40AF]/90">
                  {category}
                </Badge>
              )}
            </div>

            {description && (
              <div className="pt-4 border-t border-[#E5E7EB]">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-[#6B7280]" />
                  <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">
                    Description Preview
                  </span>
                </div>
                <p className="text-sm text-[#6B7280] line-clamp-3">
                  {description}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#E5E7EB]">
            {projectType && (
              <div className="flex items-start gap-3 p-3 bg-[#F9FAFB] rounded-lg">
                <div className="p-2 bg-white rounded-md">
                  <FolderOpen className="h-4 w-4 text-[#1E40AF]" />
                </div>
                <div>
                  <span className="text-xs text-[#6B7280] block mb-0.5">
                    Project Type
                  </span>
                  <span className="font-medium text-[#111827] text-sm">
                    {projectType}
                  </span>
                </div>
              </div>
            )}

            {location && (
              <div className="flex items-start gap-3 p-3 bg-[#F9FAFB] rounded-lg">
                <div className="p-2 bg-white rounded-md">
                  <MapPin className="h-4 w-4 text-[#1E40AF]" />
                </div>
                <div>
                  <span className="text-xs text-[#6B7280] block mb-0.5">
                    Location
                  </span>
                  <span className="font-medium text-[#111827] text-sm">
                    {location}
                  </span>
                </div>
              </div>
            )}

            {positions && (
              <div className="flex items-start gap-3 p-3 bg-[#F9FAFB] rounded-lg">
                <div className="p-2 bg-white rounded-md">
                  <Briefcase className="h-4 w-4 text-[#1E40AF]" />
                </div>
                <div>
                  <span className="text-xs text-[#6B7280] block mb-0.5">
                    Openings
                  </span>
                  <span className="font-medium text-[#111827] text-sm">
                    {positions} {positions > 1 ? "positions" : "position"}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-3 bg-[#F9FAFB] rounded-lg">
              <div className="p-2 bg-white rounded-md">
                <DollarSign className="h-4 w-4 text-[#1E40AF]" />
              </div>
              <div>
                <span className="text-xs text-[#6B7280] block mb-0.5">
                  Compensation
                </span>
                <span
                  className={`font-medium text-sm ${
                    isPaid ? "text-[#10B981]" : "text-[#6B7280]"
                  }`}
                >
                  {isPaid && salaryMin && salaryMax
                    ? `${currency} ${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()}`
                    : isPaid
                    ? "Paid (Range not specified)"
                    : "Unpaid"}
                </span>
              </div>
            </div>
          </div>

          {deadline && (
            <div className="pt-4 border-t border-[#E5E7EB]">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#6B7280]">Application Deadline:</span>
                <span className="font-medium text-[#111827]">
                  {new Date(deadline).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#111827] font-semibold flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-[#1E40AF]" />
              Publication Status
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
                  <SelectValue placeholder="Select publication status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem
                  value="DRAFT"
                  className="focus:bg-[#1E40AF]/10 focus:text-[#1E40AF]"
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Save as Draft</div>
                      <div className="text-xs text-[#6B7280]">
                        Continue editing later
                      </div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem
                  value="PUBLISHED"
                  className="focus:bg-[#1E40AF]/10 focus:text-[#1E40AF]"
                >
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Publish Now</div>
                      <div className="text-xs text-[#6B7280]">
                        Make visible to all talents
                      </div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription className="text-[#6B7280]">
              Published jobs are immediately visible to all talents on the
              platform
            </FormDescription>
          </FormItem>
        )}
      />

      <div className="p-4 bg-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-lg">
        <h4 className="text-sm font-semibold text-[#111827] mb-2 flex items-center gap-2">
          <span className="text-[#3B82F6]">💡</span>
          Before Publishing
        </h4>
        <ul className="space-y-1 text-sm text-[#6B7280]">
          <li className="flex items-start gap-2">
            <span className="text-[#10B981] mt-0.5">✓</span>
            <span>Double-check all details for accuracy</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#10B981] mt-0.5">✓</span>
            <span>Ensure contact information is correct</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#10B981] mt-0.5">✓</span>
            <span>Save as draft if you need to add more information later</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#10B981] mt-0.5">✓</span>
            <span>You can edit or unpublish the job anytime after posting</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
