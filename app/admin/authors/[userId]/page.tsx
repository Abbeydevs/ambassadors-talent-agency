import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { AuthorForm } from "@/components/admin/authors/author-form";

interface EditAuthorPageProps {
  params: Promise<{ userId: string }>;
}

export default async function EditAuthorPage({ params }: EditAuthorPageProps) {
  const { userId } = await params;

  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return notFound();
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <AuthorForm initialData={user} />
    </div>
  );
}
