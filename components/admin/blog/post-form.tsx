"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BlogPostSchema } from "@/schemas";
import { upsertBlogPost, createCategory } from "@/actions/admin/blog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { BlogPost } from "@prisma/client";

import "react-quill-new/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

import { ImageUpload } from "@/components/ui/image-upload";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Save,
  PlusCircle,
  LinkIcon,
  FileText,
  Globe,
  User,
  FolderOpen,
  ImageIcon,
} from "lucide-react";

interface PostFormProps {
  initialData?: BlogPost | null;
  categories: { id: string; name: string }[];
  authors: { id: string; name: string | null }[];
}

export const PostForm = ({
  initialData,
  categories,
  authors,
}: PostFormProps) => {
  const [isPending, startTransition] = useTransition();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCreatingCategory, startCategoryTransition] = useTransition();

  const [categoryList, setCategoryList] = useState(categories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof BlogPostSchema>>({
    resolver: zodResolver(BlogPostSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      excerpt: initialData?.excerpt || "",
      coverImage: initialData?.coverImage || "",
      categoryId: initialData?.categoryId || "",
      isPublished: initialData?.isPublished || false,
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      authorId: initialData?.authorId || authors[0]?.id || "",
      customByline: initialData?.customByline || "",
    },
  });

  const onSubmit = (values: z.infer<typeof BlogPostSchema>) => {
    startTransition(() => {
      upsertBlogPost(values, initialData?.id)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success(data.success);
            router.push("/admin/blog");
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const onAddCategory = () => {
    if (!newCategoryName) return;
    startCategoryTransition(() => {
      createCategory({ name: newCategoryName }).then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else if (data.category) {
          toast.success("Category added!");
          setCategoryList([...categoryList, data.category]);
          form.setValue("categoryId", data.category.id);
          setNewCategoryName("");
          setIsCategoryModalOpen(false);
        }
      });
    });
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              {initialData ? "Edit Post" : "Create New Post"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {initialData
                ? "Update your blog article"
                : "Write and publish a new blog article"}
            </p>
          </div>
          <Button
            type="submit"
            disabled={isPending}
            onClick={form.handleSubmit(onSubmit)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Article
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Article Content
                </CardTitle>
                <CardDescription>Write your blog post content</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold">
                        Article Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter an engaging title..."
                          className="text-lg font-medium bg-white border-gray-200 focus-visible:ring-blue-600"
                          {...field}
                        />
                      </FormControl>
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
                        Content
                      </FormLabel>
                      <FormControl>
                        <ReactQuill
                          theme="snow"
                          value={field.value}
                          onChange={field.onChange}
                          className="h-[400px] mb-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold">
                        Excerpt (Summary)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write a compelling summary for your article..."
                          className="resize-none bg-white border-gray-200 focus-visible:ring-blue-600 min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        This appears on blog listing pages and social media
                        previews
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Globe className="h-5 w-5 text-blue-600" />
                  SEO Settings
                </CardTitle>
                <CardDescription>
                  Optimize your article for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold">
                        Meta Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="SEO optimized title"
                          className="bg-white border-gray-200 focus-visible:ring-blue-600"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        Recommended: 50-60 characters
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold">
                        Meta Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description for search results..."
                          className="resize-none bg-white border-gray-200 focus-visible:ring-blue-600"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        Recommended: 150-160 characters
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Globe className="h-5 w-5 text-green-600" />
                  Publishing
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-4 shadow-sm bg-white">
                      <div className="space-y-0.5">
                        <FormLabel className="text-gray-900 font-semibold">
                          Publication Status
                        </FormLabel>
                        <FormDescription className="text-gray-500">
                          {field.value
                            ? "✓ Live and visible to public"
                            : "○ Draft mode"}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <User className="h-5 w-5 text-blue-600" />
                  Author
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="authorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold">
                        Assign To
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white border-gray-200">
                            <SelectValue placeholder="Select author" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {authors.map((author) => (
                            <SelectItem key={author.id} value={author.id}>
                              {author.name || "Unnamed Author"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="relative flex items-center py-3">
                  <span className="w-full border-t border-gray-200" />
                  <span className="absolute left-1/2 -translate-x-1/2 bg-white px-2 text-xs text-gray-500 uppercase font-medium">
                    OR
                  </span>
                </div>

                <FormField
                  control={form.control}
                  name="customByline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold">
                        Custom Byline
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Guest Author: Jane Doe"
                          className="bg-white border-gray-200 focus-visible:ring-blue-600"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500 text-xs">
                        Overrides author profile if provided
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <FolderOpen className="h-5 w-5 text-amber-600" />
                  Category
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold">
                        Select Category
                      </FormLabel>
                      <div className="flex gap-2">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white border-gray-200">
                              <SelectValue placeholder="Choose a category..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoryList.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Dialog
                          open={isCategoryModalOpen}
                          onOpenChange={setIsCategoryModalOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="border-gray-200 hover:bg-gray-50"
                            >
                              <PlusCircle className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-semibold text-gray-900">
                                Add New Category
                              </DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <Input
                                placeholder="Category name"
                                value={newCategoryName}
                                onChange={(e) =>
                                  setNewCategoryName(e.target.value)
                                }
                                className="bg-white border-gray-200 focus-visible:ring-blue-600"
                              />
                            </div>
                            <DialogFooter>
                              <Button
                                onClick={onAddCategory}
                                disabled={isCreatingCategory}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                {isCreatingCategory
                                  ? "Creating..."
                                  : "Create Category"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <ImageIcon className="h-5 w-5 text-purple-600" />
                  Featured Image
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          value={field.value || ""}
                          variant="cover"
                          disabled={isPending}
                          onChange={(url) => field.onChange(url)}
                          onRemove={() => field.onChange("")}
                        />
                      </FormControl>

                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-200"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-gray-500 font-medium">
                            Or use URL
                          </span>
                        </div>
                      </div>

                      <FormControl>
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                            disabled={isPending}
                            className="bg-white border-gray-200 focus-visible:ring-blue-600"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Form>
  );
};
