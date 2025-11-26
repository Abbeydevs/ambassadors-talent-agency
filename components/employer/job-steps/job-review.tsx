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

interface JobReviewProps {
  form: UseFormReturn<any>;
}

export const JobReview = ({ form }: JobReviewProps) => {
  const watchedValues = useWatch({ control: form.control });
  const { isPaid, title, projectType, location, salaryMin, salaryMax } =
    watchedValues;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-slate-50 p-6 rounded-lg space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2">Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground block">Title</span>
            <span className="font-medium">{title}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Type</span>
            <span className="font-medium">{projectType}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Location</span>
            <span className="font-medium">{location}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Pay</span>
            <span className="font-medium text-green-600">
              {isPaid ? `${salaryMin} - ${salaryMax}` : "Unpaid"}
            </span>
          </div>
        </div>
      </div>

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="DRAFT">Save as Draft</SelectItem>
                <SelectItem value="PUBLISHED">Publish Now</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Published jobs are visible to all talents immediately.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
};
