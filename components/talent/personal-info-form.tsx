"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PersonalDetailsSchema } from "@/schemas";
import { updatePersonalDetails } from "@/actions/talent/update-personal";
import { useAutoSave } from "@/hooks/use-auto-save";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Save, CheckCircle2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { ImageUpload } from "../ui/image-upload";
import { TalentProfile, User } from "@prisma/client";

interface PersonalInfoFormProps {
  initialData?: (TalentProfile & { user: User }) | null;
}

export const PersonalInfoForm = ({ initialData }: PersonalInfoFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof PersonalDetailsSchema>>({
    resolver: zodResolver(PersonalDetailsSchema),
    defaultValues: {
      name: initialData?.user?.name || "",
      stageName: initialData?.stageName || "",
      headline: initialData?.headline || "",
      bio: initialData?.bio || "",
      phone: initialData?.phone || "",
      country: initialData?.country || "",
      city: initialData?.city || "",
      image: initialData?.user?.image || "",
      gender: initialData?.gender || undefined,
      dateOfBirth: initialData?.dateOfBirth || undefined,
    },
    mode: "onChange",
  });

  useAutoSave(form, async (values) => {
    const result = await updatePersonalDetails(values);
    return { success: result.success, error: result.error };
  });

  const onSubmit = (values: z.infer<typeof PersonalDetailsSchema>) => {
    startTransition(() => {
      updatePersonalDetails(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success("Profile updated!");
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center space-y-4">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormControl>
                  <ImageUpload
                    value={field.value || ""}
                    disabled={isPending}
                    onChange={(url) => {
                      field.onChange(url);
                    }}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormDescription className="text-center">
                  Upload a professional photo (JPG, PNG - Max 5MB)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Basic Information Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b">
            <div className="h-1 w-1 rounded-full bg-[#1E40AF]"></div>
            <h3 className="font-semibold text-gray-900">Basic Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Full Name *</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="e.g. John Doe"
                      className="h-11 border-gray-300 focus:border-[#1E40AF] focus:ring-[#1E40AF]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stageName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Stage Name (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="e.g. J-Star"
                      className="h-11 border-gray-300 focus:border-[#1E40AF] focus:ring-[#1E40AF]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    How you want to be known professionally
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="headline"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel className="text-gray-700">
                    Professional Headline
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="e.g. Senior Software Engineer | Voiceover Artist"
                      className="h-11 border-gray-300 focus:border-[#1E40AF] focus:ring-[#1E40AF]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    This is the main title employers will see in search results.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-gray-700">Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-11 w-full pl-3 text-left font-normal border-gray-300 hover:border-[#1E40AF]",
                            !field.value && "text-muted-foreground"
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
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 border-gray-300 focus:border-[#1E40AF] focus:ring-[#1E40AF]">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                      <SelectItem value="PREFER_NOT_TO_SAY">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b">
            <div className="h-1 w-1 rounded-full bg-[#1E40AF]"></div>
            <h3 className="font-semibold text-gray-900">Contact Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Phone Number *
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="+234 800 000 0000"
                      className="h-11 border-gray-300 focus:border-[#1E40AF] focus:ring-[#1E40AF]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      className="h-11 border-gray-300 focus:border-[#1E40AF] focus:ring-[#1E40AF]"
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
                      className="h-11 border-gray-300 focus:border-[#1E40AF] focus:ring-[#1E40AF]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b">
            <div className="h-1 w-1 rounded-full bg-[#1E40AF]"></div>
            <h3 className="font-semibold text-gray-900">About You</h3>
          </div>

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Bio *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself, your experience, and what drives you..."
                    className="resize-none h-32 border-gray-300 focus:border-[#1E40AF] focus:ring-[#1E40AF]"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Brief description for your profile card (Max 500 characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Auto-save enabled</span>
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-linear-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#1E40AF]/90 hover:to-[#3B82F6]/90 h-11 px-8"
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
