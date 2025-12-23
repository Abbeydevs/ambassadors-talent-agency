import { getCategories } from "@/actions/blog";
import { PostForm } from "@/components/admin/blog/post-form";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export default async function CreatePostPage() {
  const [categoriesData, authors] = await Promise.all([
    getCategories(),
    db.user.findMany({
      where: { role: { in: [Role.ADMIN, Role.AUTHOR] } },
      select: { id: true, name: true },
    }),
  ]);
  const categories = categoriesData.success || [];

  return (
    <div className="max-w-5xl mx-auto py-8">
      <PostForm categories={categories} authors={authors} />
    </div>
  );
}
