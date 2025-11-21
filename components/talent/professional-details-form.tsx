"use client";

import * as z from "zod";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfessionalDetailsSchema } from "@/schemas";
import { updateProfessionalDetails } from "@/actions/talent/update-professional";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useTransition } from "react";
import { toast } from "sonner";
import { TalentProfile } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect } from "@/components/ui/multi-select";
import { Loader2 } from "lucide-react";

// Define the form values type safely
type FormValues = z.infer<typeof ProfessionalDetailsSchema>;

// Mock Data for Dropdowns (You can move these to a constants file)
const CATEGORY_OPTIONS = [
  { label: "Actor", value: "Actor" },
  { label: "Model", value: "Model" },
  { label: "Dancer", value: "Dancer" },
  { label: "Musician", value: "Musician" },
  { label: "Comedian", value: "Comedian" },
  { label: "Presenter", value: "Presenter" },
  { label: "Voice Over Artist", value: "Voice Over Artist" },
  { label: "Influencer", value: "Influencer" },
];

const SKILL_OPTIONS = [
  { label: "Improvisation", value: "Improvisation" },
  { label: "Singing", value: "Singing" },
  { label: "Dancing (Ballet)", value: "Dancing (Ballet)" },
  { label: "Dancing (Hip Hop)", value: "Dancing (Hip Hop)" },
  { label: "Guitar", value: "Guitar" },
  { label: "Piano", value: "Piano" },
  { label: "Stunt Work", value: "Stunt Work" },
  { label: "Accents", value: "Accents" },
];

const UNION_OPTIONS = [
  { label: "Actors Guild of Nigeria (AGN)", value: "AGN" },
  { label: "Performers Musician Employers Association (PMAN)", value: "PMAN" },
  { label: "Screen Writers Guild", value: "SWG" },
];

interface ProfessionalDetailsFormProps {
  initialData?: TalentProfile | null;
}

export const ProfessionalDetailsForm = ({
  initialData,
}: ProfessionalDetailsFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(ProfessionalDetailsSchema) as Resolver<FormValues>,
    defaultValues: {
      talentCategories: initialData?.talentCategories || [],
      yearsOfExperience: initialData?.yearsOfExperience || 0,
      skills: initialData?.skills || [],
      unionMemberships: initialData?.unionMemberships || [],
      availabilityStatus: initialData?.availabilityStatus || "AVAILABLE",
      willingToTravel: initialData?.willingToTravel || false,
    },
    mode: "onChange",
  });

  useAutoSave(form, async (values) => {
    const result = await updateProfessionalDetails(values);
    return { success: result.success, error: result.error };
  });

  const onSubmit = (values: FormValues) => {
    startTransition(() => {
      updateProfessionalDetails(values)
        .then((data) => {
          if (data.error) toast.error(data.error);
          else toast.success("Professional details saved!");
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl"
      >
        {/* Talent Category (Multi-Select) */}
        <FormField
          control={form.control}
          name="talentCategories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Talent Category</FormLabel>
              <FormControl>
                <MultiSelect
                  selected={field.value}
                  options={CATEGORY_OPTIONS}
                  onChange={field.onChange}
                  placeholder="Select categories..."
                />
              </FormControl>
              <FormDescription>Select all that apply to you.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Years of Experience */}
          <FormField
            control={form.control}
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    disabled={isPending}
                    placeholder="e.g. 5"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const val =
                        e.target.value === "" ? 0 : Number(e.target.value);
                      field.onChange(val);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Availability Status */}
          <FormField
            control={form.control}
            name="availabilityStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">
                      Available for work
                    </SelectItem>
                    <SelectItem value="BUSY">
                      Currently Busy / On Project
                    </SelectItem>
                    <SelectItem value="NEGOTIABLE">
                      Negotiable / Open to offers
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Skills (Multi-Select) */}
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills & Special Talents</FormLabel>
              <FormControl>
                <MultiSelect
                  selected={field.value || []}
                  options={SKILL_OPTIONS}
                  onChange={field.onChange}
                  placeholder="Select skills..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Union Memberships (Multi-Select) */}
        <FormField
          control={form.control}
          name="unionMemberships"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Union/Guild Memberships (Optional)</FormLabel>
              <FormControl>
                <MultiSelect
                  selected={field.value || []}
                  options={UNION_OPTIONS}
                  onChange={field.onChange}
                  placeholder="Select unions..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Willing to Travel (Checkbox) */}
        <FormField
          control={form.control}
          name="willingToTravel"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-slate-50">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Willing to Travel?</FormLabel>
                <FormDescription>
                  Check this if you are open to projects outside your current
                  city/country.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending} className="bg-[#1E40AF]">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};
