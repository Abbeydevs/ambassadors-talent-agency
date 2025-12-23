import { db } from "@/lib/db";
import { getCategories } from "@/actions/blog";
import { PostForm } from "@/components/admin/blog/post-form";
import { notFound } from "next/navigation";

interface EditPostPageProps {
  params: Promise<{ postId: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { postId } = await params;

  const [post, categoriesData] = await Promise.all([
    db.blogPost.findUnique({
      where: { id: postId },
    }),
    getCategories(),
  ]);

  if (!post) {
    return notFound();
  }

  const categories = categoriesData.success || [];

  return (
    <div className="max-w-5xl mx-auto py-8">
      <PostForm initialData={post} categories={categories} />
    </div>
  );
}
