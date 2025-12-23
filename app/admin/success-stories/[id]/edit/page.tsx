import { getSuccessStoryById } from "@/data/success-stories";
import { getTalentsForSelect } from "@/data/talents";
import CreateStoryForm from "@/components/admin/success-stories/create-story-form";
import { notFound } from "next/navigation";

interface EditStoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStoryPage({ params }: EditStoryPageProps) {
  const { id } = await params;

  const [story, talents] = await Promise.all([
    getSuccessStoryById(id),
    getTalentsForSelect(),
  ]);

  if (!story) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Edit Success Story
        </h1>
      </div>

      <div className="max-w-3xl">
        <CreateStoryForm talents={talents} initialData={story} />
      </div>
    </div>
  );
}
