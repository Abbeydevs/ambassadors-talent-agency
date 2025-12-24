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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Save,
  Loader2,
  BookOpen,
  User,
  FileText,
  Settings,
  ImageIcon,
  LinkIcon,
} from "lucide-react";

interface StoryFormProps {
  talents: { id: string; name: string | null; email: string }[];
  initialData?: SuccessStory | null;
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
      talentId: initialData?.talentId || "",
      featured: initialData?.featured || false,
      isPublished: initialData?.isPublished || false,
    },
  });

  const onSubmit = (values: z.infer<typeof SuccessStorySchema>) => {
    startTransition(() => {
      if (initialData) {
        updateSuccessStory(values, initialData.id).then((data) => {
          if (data.error) toast.error(data.error);
          if (data.success) {
            toast.success(data.success);
            router.push("/admin/success-stories");
            router.refresh();
          }
        });
      } else {
        createSuccessStory(values).then((data) => {
          if (data.error) toast.error(data.error);
          if (data.success) {
            toast.success(data.success);
            router.push("/admin/success-stories");
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
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
              {initialData ? "Edit Success Story" : "Create Success Story"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {initialData
                ? "Update the success story details"
                : "Share an inspiring talent success story"}
            </p>
          </div>
          <Button
            type="submit"
            disabled={isPending}
            onClick={form.handleSubmit(onSubmit)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {initialData ? "Update Story" : "Create Story"}
              </>
            )}
          </Button>
        </div>

        {/* COVER IMAGE */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <ImageIcon className="h-5 w-5 text-indigo-600" />
              Cover Image
            </CardTitle>
            <CardDescription>
              Upload a high-quality cover image for the story
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
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
          </CardContent>
        </Card>

        {/* BASIC DETAILS */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <FileText className="h-5 w-5 text-indigo-600" />
              Basic Details
            </CardTitle>
            <CardDescription>
              Enter the story title and URL slug
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-semibold">
                      Story Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="e.g. From Local Stage to Broadway"
                        onChange={generateSlug}
                        className="bg-white border-gray-200 focus-visible:ring-blue-600"
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
                    <FormLabel className="text-gray-900 font-semibold">
                      URL Slug
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="from-local-stage-to-broadway"
                          className="bg-white border-gray-200 focus-visible:ring-blue-600"
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      Unique URL identifier for this story
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* TALENT & CATEGORY */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <User className="h-5 w-5 text-indigo-600" />
              Talent & Category
            </CardTitle>
            <CardDescription>
              Select the featured talent and story category
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="talentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-semibold">
                      Select Talent
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white border-gray-200">
                          <SelectValue placeholder="Choose a talent..." />
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

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-semibold">
                      Category
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white border-gray-200">
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
          </CardContent>
        </Card>

        {/* CONTENT */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              Story Content
            </CardTitle>
            <CardDescription>Write the inspiring success story</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 font-semibold">
                    Short Excerpt (Quote)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isPending}
                      placeholder="A short, inspiring quote from the talent..."
                      className="resize-none bg-white border-gray-200 focus-visible:ring-blue-600 min-h-20"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500">
                    A memorable quote that appears in story previews
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 font-semibold">
                    Full Story Content
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isPending}
                      placeholder="Write the complete success story here..."
                      className="min-h-[250px] bg-white border-gray-200 focus-visible:ring-blue-600"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500">
                    Tell the complete journey and achievements
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* PUBLISHING OPTIONS */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Settings className="h-5 w-5 text-indigo-600" />
              Publishing Options
            </CardTitle>
            <CardDescription>
              Configure visibility and featured status
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-gray-200 p-4 shadow-sm bg-white">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-gray-900 font-semibold">
                      Mark as Featured
                    </FormLabel>
                    <FormDescription className="text-gray-500 text-sm">
                      Featured stories appear prominently on the homepage
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-gray-200 p-4 shadow-sm bg-white">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-gray-900 font-semibold">
                      Publish Immediately
                    </FormLabel>
                    <FormDescription className="text-gray-500 text-sm">
                      Make this story visible to the public right away
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            onClick={form.handleSubmit(onSubmit)}
            className="bg-blue-600 hover:bg-blue-700 px-8"
            size="lg"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {initialData ? "Update Success Story" : "Create Success Story"}
              </>
            )}
          </Button>
        </div>
      </div>
    </Form>
  );
}
