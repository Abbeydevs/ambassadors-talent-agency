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
import { Loader2, Save, CheckCircle2, Plane } from "lucide-react";

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Professional Category Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b">
            <div className="h-1 w-1 rounded-full bg-amber-600"></div>
            <h3 className="font-semibold text-gray-900">
              Professional Category
            </h3>
          </div>

          <FormField
            control={form.control}
            name="talentCategories"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  Talent Category *
                </FormLabel>
                <FormControl>
                  <MultiSelect
                    selected={field.value}
                    options={CATEGORY_OPTIONS}
                    onChange={field.onChange}
                    placeholder="Select categories..."
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Select all categories that apply to you
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Experience & Availability Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b">
            <div className="h-1 w-1 rounded-full bg-amber-600"></div>
            <h3 className="font-semibold text-gray-900">
              Experience & Availability
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Years of Experience *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      disabled={isPending}
                      placeholder="e.g. 5"
                      className="h-11 border-gray-300 focus:border-amber-600 focus:ring-amber-600"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val =
                          e.target.value === "" ? 0 : Number(e.target.value);
                        field.onChange(val);
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Total years working professionally
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availabilityStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Availability Status *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 border-gray-300 focus:border-amber-600 focus:ring-amber-600">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AVAILABLE">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span>Available for work</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="BUSY">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                          <span>Currently Busy / On Project</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="NEGOTIABLE">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                          <span>Negotiable / Open to offers</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    Let employers know your current status
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Skills & Talents Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b">
            <div className="h-1 w-1 rounded-full bg-amber-600"></div>
            <h3 className="font-semibold text-gray-900">Skills & Talents</h3>
          </div>

          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  Special Skills & Talents
                </FormLabel>
                <FormControl>
                  <MultiSelect
                    selected={field.value || []}
                    options={SKILL_OPTIONS}
                    onChange={field.onChange}
                    placeholder="Select skills..."
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Highlight your unique abilities and special talents
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Professional Memberships Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b">
            <div className="h-1 w-1 rounded-full bg-amber-600"></div>
            <h3 className="font-semibold text-gray-900">
              Professional Memberships
            </h3>
          </div>

          <FormField
            control={form.control}
            name="unionMemberships"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  Union/Guild Memberships (Optional)
                </FormLabel>
                <FormControl>
                  <MultiSelect
                    selected={field.value || []}
                    options={UNION_OPTIONS}
                    onChange={field.onChange}
                    placeholder="Select unions..."
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Add any professional unions or guilds you belong to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Travel Preferences Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b">
            <div className="h-1 w-1 rounded-full bg-amber-600"></div>
            <h3 className="font-semibold text-gray-900">Work Preferences</h3>
          </div>

          <FormField
            control={form.control}
            name="willingToTravel"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border-2 p-5 bg-linear-to-br from-amber-50/50 to-orange-50/50 hover:border-amber-300 transition-colors">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-1"
                  />
                </FormControl>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Plane className="h-4 w-4 text-amber-600" />
                    <FormLabel className="text-gray-900 font-semibold cursor-pointer">
                      Willing to Travel
                    </FormLabel>
                  </div>
                  <FormDescription className="text-xs text-gray-600">
                    Check this if you are open to projects outside your current
                    city or country. This increases your visibility to employers
                    in other locations.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Auto-save enabled</span>
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 h-11 px-8"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
