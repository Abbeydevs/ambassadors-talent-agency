/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { UseFormReturn, useWatch } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CalendarIcon, DollarSign, Sparkles } from "lucide-react";
import { format } from "date-fns";

interface JobCompensationProps {
  form: UseFormReturn<any>;
}

export const JobCompensation = ({ form }: JobCompensationProps) => {
  const isPaid = useWatch({
    control: form.control,
    name: "isPaid",
  });
  const currency = useWatch({
    control: form.control,
    name: "currency",
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-start gap-3 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
        <div className="p-2 bg-[#1E40AF]/10 rounded-lg">
          <Sparkles className="h-5 w-5 text-[#1E40AF]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#111827] mb-1">
            Compensation & Timeline
          </h3>
          <p className="text-sm text-[#6B7280]">
            Set clear expectations about payment and application deadlines.
            Transparency helps attract serious candidates.
          </p>
        </div>
      </div>

      {/* Paid Position Toggle */}
      <FormField
        control={form.control}
        name="isPaid"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#E5E7EB] p-4 bg-white hover:border-[#1E40AF] transition-colors">
            <div className="space-y-0.5">
              <FormLabel className="text-[#111827] font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#1E40AF]" />
                Paid Position
              </FormLabel>
              <FormDescription className="text-[#6B7280]">
                Is this a compensated role?
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-[#1E40AF]"
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Salary Range */}
      {isPaid && (
        <div className="space-y-4 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-[#1E40AF]" />
            <h4 className="text-sm font-semibold text-[#111827]">
              Salary Range
            </h4>
            <Badge
              variant="outline"
              className="ml-auto text-xs border-[#F59E0B] text-[#F59E0B]"
            >
              Optional
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="salaryMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#111827] font-medium">
                    Minimum Pay ({currency})
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                        {currency === "USD"
                          ? "$"
                          : currency === "EUR"
                          ? "€"
                          : "₦"}
                      </span>
                      <Input
                        type="number"
                        className="border-[#E5E7EB] focus:border-[#1E40AF] focus:ring-[#1E40AF] text-[#111827] pl-8"
                        placeholder="0"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-[#6B7280]">
                    Starting compensation
                  </FormDescription>
                  <FormMessage className="text-[#EF4444]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salaryMax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#111827] font-medium">
                    Maximum Pay ({currency})
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                        {currency === "USD"
                          ? "$"
                          : currency === "EUR"
                          ? "€"
                          : "₦"}
                      </span>
                      <Input
                        type="number"
                        className="border-[#E5E7EB] focus:border-[#1E40AF] focus:ring-[#1E40AF] text-[#111827] pl-8"
                        placeholder="0"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-[#6B7280]">
                    Top of the range
                  </FormDescription>
                  <FormMessage className="text-[#EF4444]" />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}

      {/* Application Deadline */}
      <FormField
        control={form.control}
        name="deadline"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-[#111827] font-semibold flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-[#1E40AF]" />
              Application Deadline
              <Badge
                variant="outline"
                className="ml-auto text-xs border-[#10B981] text-[#10B981]"
              >
                Optional
              </Badge>
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal border-[#E5E7EB] hover:border-[#1E40AF] hover:bg-[#1E40AF]/5 transition-colors",
                      !field.value && "text-[#9CA3AF]",
                      field.value && "text-[#111827]"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                />
              </PopoverContent>
            </Popover>
            <FormDescription className="text-[#6B7280]">
              When should candidates submit their applications by?
            </FormDescription>
            <FormMessage className="text-[#EF4444]" />
          </FormItem>
        )}
      />

      {/* Tips Section */}
      <div className="p-4 bg-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-lg">
        <h4 className="text-sm font-semibold text-[#111827] mb-2 flex items-center gap-2">
          <span className="text-[#3B82F6]">💡</span>
          Compensation Best Practices
        </h4>
        <ul className="space-y-1 text-sm text-[#6B7280]">
          <li className="flex items-start gap-2">
            <span className="text-[#10B981] mt-0.5">✓</span>
            <span>Provide a salary range to set clear expectations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#10B981] mt-0.5">✓</span>
            <span>Include per-day or per-project rates if applicable</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#10B981] mt-0.5">✓</span>
            <span>Set realistic deadlines that allow quality applications</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#10B981] mt-0.5">✓</span>
            <span>
              For unpaid roles, highlight exposure, credits, or other benefits
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
