import { getCategories } from "@/actions/blog";
import { PostForm } from "@/components/admin/blog/post-form";

export default async function CreatePostPage() {
  const categoriesData = await getCategories();
  const categories = categoriesData.success || [];

  return (
    <div className="max-w-5xl mx-auto py-8">
      <PostForm categories={categories} />
    </div>
  );
}
