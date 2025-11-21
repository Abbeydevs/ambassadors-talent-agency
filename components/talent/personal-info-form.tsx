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
import { CalendarIcon, Loader2 } from "lucide-react";
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl"
      >
        <div className="flex justify-center mb-8">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="e.g. John Doe"
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
                <FormLabel>Stage Name (Optional)</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="e.g. J-Star"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  How you want to be known professionally
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
                <FormLabel>Date of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
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
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
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

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="Select Country"
                    {...field}
                  />
                  {/* Note: In future we can use a country-selector component here */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* City */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="e.g. Lagos"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input disabled={isPending} placeholder="+234..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself, your experience, and what drives you..."
                  className="resize-none h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Brief description for your profile card (Max 500 chars).
              </FormDescription>
              <FormMessage />
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
