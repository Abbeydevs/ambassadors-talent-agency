"use client";

import * as z from "zod";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanyProfileSchema } from "@/schemas";
import { updateCompanyProfile } from "@/actions/employer/update-company";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useTransition } from "react";
import { toast } from "sonner";
import { EmployerProfile, User } from "@prisma/client";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { Loader2, Save, CheckCircle2 } from "lucide-react";

const INDUSTRY_OPTIONS = [
  "Entertainment",
  "Media",
  "Fashion",
  "Advertising",
  "Film & TV",
  "Music",
  "Technology",
  "Events",
  "Other",
];

const SIZE_OPTIONS = [
  { label: "1-10 Employees", value: "10" },
  { label: "11-50 Employees", value: "50" },
  { label: "51-200 Employees", value: "200" },
  { label: "201-500 Employees", value: "500" },
  { label: "500+ Employees", value: "1000" },
];

type FormValues = z.infer<typeof CompanyProfileSchema>;

interface CompanyProfileFormProps {
  initialData?: (EmployerProfile & { user: User }) | null;
}

export const CompanyProfileForm = ({
  initialData,
}: CompanyProfileFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(CompanyProfileSchema) as Resolver<FormValues>,
    defaultValues: {
      companyName:
        initialData?.user?.companyName || initialData?.user?.name || "",
      image: initialData?.user?.image || "",
      companyDescription: initialData?.companyDescription || "",
      industryType: initialData?.industryType || "",
      country: initialData?.country || "",
      city: initialData?.city || "",
      websiteUrl: initialData?.websiteUrl || "",
      companySize: initialData?.companySize || undefined,
      foundedYear: initialData?.foundedYear || undefined,
    },
    mode: "onChange",
  });

  useAutoSave(form, async (values) => {
    const result = await updateCompanyProfile(values);
    return { success: result.success, error: result.error };
  });

  const onSubmit = (values: FormValues) => {
    startTransition(() => {
      updateCompanyProfile(values)
        .then((data) => {
          if (data.error) toast.error(data.error);
          else toast.success("Company profile updated!");
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Company Logo Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b">
            <div className="h-1 w-1 rounded-full bg-green-600"></div>
            <h3 className="font-semibold text-gray-900">Company Branding</h3>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel className="text-gray-700 mb-2">
                    Company Logo
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value || ""}
                      disabled={isPending}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormDescription className="text-center text-xs">
                    Upload your company logo (JPG, PNG - Max 5MB)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b">
            <div className="h-1 w-1 rounded-full bg-green-600"></div>
            <h3 className="font-semibold text-gray-900">Basic Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Company Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="e.g. Acme Productions"
                      className="h-11 border-gray-300 focus:border-green-600 focus:ring-green-600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Industry *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 border-gray-300 focus:border-green-600 focus:ring-green-600">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INDUSTRY_OPTIONS.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Website URL</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="https://acme.com"
                      className="h-11 border-gray-300 focus:border-green-600 focus:ring-green-600"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Company Size</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    defaultValue={
                      field.value ? field.value.toString() : undefined
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 border-gray-300 focus:border-green-600 focus:ring-green-600">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SIZE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="foundedYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Founded Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isPending}
                      placeholder="e.g. 2010"
                      className="h-11 border-gray-300 focus:border-green-600 focus:ring-green-600"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b">
            <div className="h-1 w-1 rounded-full bg-green-600"></div>
            <h3 className="font-semibold text-gray-900">Location</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Country *</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="e.g. Nigeria"
                      className="h-11 border-gray-300 focus:border-green-600 focus:ring-green-600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">City *</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="e.g. Lagos"
                      className="h-11 border-gray-300 focus:border-green-600 focus:ring-green-600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b">
            <div className="h-1 w-1 rounded-full bg-green-600"></div>
            <h3 className="font-semibold text-gray-900">Company Description</h3>
          </div>

          <FormField
            control={form.control}
            name="companyDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  About Your Company
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your company, what you do, and what makes you unique..."
                    className="resize-none h-32 border-gray-300 focus:border-green-600 focus:ring-green-600"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  This will be displayed on your job postings and company
                  profile
                </FormDescription>
                <FormMessage />
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
            className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-11 px-8"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Company Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
