import CreateStoryForm from "@/components/admin/success-stories/create-story-form";
import { getTalentsForSelect } from "@/data/talents";

export default async function CreateStoryPage() {
  const talents = await getTalentsForSelect();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Create Success Story
        </h1>
      </div>

      <div className="max-w-3xl">
        <CreateStoryForm talents={talents} />
      </div>
    </div>
  );
}
