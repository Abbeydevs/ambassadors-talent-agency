"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventSchema } from "@/schemas";
import { createEvent } from "@/actions/admin/create-event";
import { updateEvent } from "@/actions/admin/update-event";
import { ImageUpload } from "@/components/ui/image-upload";
import { Event } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format, setHours, setMinutes } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface EventFormProps {
  initialData?: Event | null;
}

export default function EventForm({ initialData }: EventFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: initialData?.startDate,
    to: initialData?.endDate,
  });

  const form = useForm<z.infer<typeof EventSchema>>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      location: initialData?.location || "",
      coverImage: initialData?.coverImage || "",
      category: initialData?.category || "",
      featured: initialData?.featured || false,
      isPublished: initialData?.isPublished || false,
      startDate: initialData?.startDate || new Date(),
      endDate: initialData?.endDate || new Date(),
    },
  });

  const combineDateAndTime = (date: Date | undefined, timeString: string) => {
    if (!date) return undefined;
    const [hours, minutes] = timeString.split(":").map(Number);
    return setMinutes(setHours(date, hours), minutes);
  };

  const defaultCategories = [
    "Audition",
    "Workshop",
    "Networking",
    "Performance",
    "Webinar",
  ];

  const currentCategory = useWatch({
    control: form.control,
    name: "category",
  });
  const isCustomCategory =
    currentCategory && !defaultCategories.includes(currentCategory);

  const [showCustomInput, setShowCustomInput] = useState(isCustomCategory);

  const onSubmit = (values: z.infer<typeof EventSchema>) => {
    if (!dateRange || !dateRange.from || !dateRange.to) {
      toast.error("Please select a date range");
      return;
    }

    const startTime = (document.getElementById("startTime") as HTMLInputElement)
      .value;
    const endTime = (document.getElementById("endTime") as HTMLInputElement)
      .value;

    const finalStartDate = combineDateAndTime(dateRange.from, startTime);
    const finalEndDate = combineDateAndTime(dateRange.to, endTime);

    if (!finalStartDate || !finalEndDate) {
      toast.error("Invalid time selection");
      return;
    }

    values.startDate = finalStartDate;
    values.endDate = finalEndDate;

    startTransition(() => {
      if (initialData) {
        updateEvent(values, initialData.id).then((data) => {
          if (data.error) toast.error(data.error);
          if (data.success) {
            toast.success(data.success);
            router.push("/admin/events");
            router.refresh();
          }
        });
      } else {
        createEvent(values).then((data) => {
          if (data.error) toast.error(data.error);
          if (data.success) {
            toast.success(data.success);
            router.push("/admin/events");
            router.refresh();
          }
        });
      }
    });
  };

  const generateSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!initialData) {
      const value = e.target.value;
      form.setValue("title", value);
      const slug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
      form.setValue("slug", slug);
    } else {
      form.setValue("title", e.target.value);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-white p-6 rounded-lg shadow border"
      >
        {/* IMAGE UPLOAD */}
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Cover Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value || ""}
                  onChange={field.onChange}
                  onRemove={() => field.onChange("")}
                  variant="cover"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Summer Auditions 2024"
                    onChange={generateSlug}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug (URL)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="summer-auditions-2024"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Type</FormLabel>
                {showCustomInput ? (
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Type your custom category..."
                        autoFocus
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCustomInput(false);
                        field.onChange(""); // Reset so they pick from list
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Select
                    onValueChange={(value) => {
                      if (value === "_custom") {
                        setShowCustomInput(true);
                        field.onChange(""); // Clear value for typing
                      } else {
                        field.onChange(value);
                      }
                    }}
                    // If the value is not in our list, it's custom -> don't show select value
                    defaultValue={isCustomCategory ? undefined : field.value}
                    value={isCustomCategory ? undefined : field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {defaultCategories.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                      <SelectItem
                        value="_custom"
                        className="font-bold text-blue-600"
                      >
                        + Create New Type...
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="E.g. Muson Center, Lagos (or Zoom Link)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* --- DATE RANGE & TIME PICKER --- */}
        <div className="space-y-2">
          <FormLabel>Date & Time</FormLabel>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange?.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 2. Start Time Input */}
            <div className="w-full md:w-[150px]">
              <Input
                id="startTime"
                type="time"
                defaultValue={
                  initialData?.startDate
                    ? format(initialData.startDate, "HH:mm")
                    : "09:00"
                }
                className="w-full"
              />
            </div>

            {/* 3. End Time Input */}
            <div className="w-full md:w-[150px]">
              <Input
                id="endTime"
                type="time"
                defaultValue={
                  initialData?.endDate
                    ? format(initialData.endDate, "HH:mm")
                    : "17:00"
                }
                className="w-full"
              />
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isPending}
                  placeholder="What is this event about? Who should attend?"
                  className="min-h-[150px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-4 p-4 border rounded-md bg-slate-50">
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Feature this Event</FormLabel>
                  <FormDescription>
                    Show on the dashboard or top of lists.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Publish Immediately</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending
            ? "Saving..."
            : initialData
            ? "Update Event"
            : "Create Event"}
        </Button>
      </form>
    </Form>
  );
}
