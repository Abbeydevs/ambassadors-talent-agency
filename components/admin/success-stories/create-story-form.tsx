"use client";

import * as z from "zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SuccessStorySchema } from "@/schemas";
import { createSuccessStory } from "@/actions/admin/create-story";
import { updateSuccessStory } from "@/actions/admin/update-story";
import { ImageUpload } from "@/components/ui/image-upload";
import { SuccessStory } from "@prisma/client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface StoryFormProps {
  talents: { id: string; name: string | null; email: string }[];
  initialData?: SuccessStory | null; // Optional initial data for editing
}

export default function CreateStoryForm({
  talents,
  initialData,
}: StoryFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof SuccessStorySchema>>({
    resolver: zodResolver(SuccessStorySchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      category: initialData?.category || "",
      coverImage: initialData?.coverImage || "",
      talentId: initialData?.talentId || "", // This might be null in DB, handle carefully
      featured: initialData?.featured || false,
      isPublished: initialData?.isPublished || false,
    },
  });

  const onSubmit = (values: z.infer<typeof SuccessStorySchema>) => {
    startTransition(() => {
      if (initialData) {
        // EDIT MODE
        updateSuccessStory(values, initialData.id).then((data) => {
          if (data.error) toast.error(data.error);
          if (data.success) {
            toast.success(data.success);
            router.push("/admin/success-stories");
            router.refresh();
          }
        });
      } else {
        // CREATE MODE
        createSuccessStory(values).then((data) => {
          if (data.error) toast.error(data.error);
          if (data.success) {
            toast.success(data.success);
            router.push("/admin/success-stories"); // Redirect to list
            router.refresh();
          }
        });
      }
    });
  };

  const generateSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only auto-generate slug in create mode to avoid accidental URL changes in edit
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
        className="space-y-6 bg-white p-6 rounded-lg shadow border"
      >
        {/* IMAGE UPLOAD */}
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
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
          {/* TITLE */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="e.g. From Local Stage to Broadway"
                    onChange={generateSlug}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* SLUG */}
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
                    placeholder="from-local-stage-to-broadway"
                  />
                </FormControl>
                <FormDescription>Unique URL for this story</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TALENT SELECT */}
          <FormField
            control={form.control}
            name="talentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Talent</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || undefined}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a talent..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {talents.map((talent) => (
                      <SelectItem key={talent.id} value={talent.id}>
                        {talent.name || talent.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CATEGORY */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Actor">Actor</SelectItem>
                    <SelectItem value="Model">Model</SelectItem>
                    <SelectItem value="Musician">Musician</SelectItem>
                    <SelectItem value="Dancer">Dancer</SelectItem>
                    <SelectItem value="Comedian">Comedian</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* EXCERPT */}
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Excerpt (Quote)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isPending}
                  placeholder="A short, inspiring quote..."
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CONTENT */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Story Content</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isPending}
                  placeholder="Write the full success story here..."
                  className="min-h-[200px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* OPTIONS */}
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
                  <FormLabel>Mark as Featured</FormLabel>
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
            ? "Update Success Story"
            : "Create Success Story"}
        </Button>
      </form>
    </Form>
  );
}
