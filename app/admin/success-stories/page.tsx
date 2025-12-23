import Link from "next/link";
import Image from "next/image";
import { getAdminStories } from "@/data/success-stories";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Eye, Star } from "lucide-react";
import { DeleteStoryButton } from "@/components/admin/success-stories/delete-button";

export default async function AdminStoriesPage() {
  const stories = await getAdminStories();

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Success Stories</h1>
          <p className="text-muted-foreground">
            Manage and curate talent success stories ({stories.length})
          </p>
        </div>
        <Link href="/admin/success-stories/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Story
          </Button>
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-md border shadow-sm">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  Cover
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  Title
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  Talent
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {stories.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No stories found. Click &quot;Create New Story&quot; to add
                    one.
                  </td>
                </tr>
              ) : (
                stories.map((story) => (
                  <tr
                    key={story.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="p-4 align-middle">
                      <div className="relative h-12 w-20 rounded overflow-hidden bg-slate-100">
                        {story.coverImage ? (
                          <Image
                            src={story.coverImage}
                            alt={story.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs text-slate-400">
                            No Img
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle font-medium">
                      {story.title}
                      {story.featured && (
                        <span className="ml-2 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600">
                          <Star className="w-3 h-3 mr-1 fill-amber-600" />{" "}
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden bg-slate-200">
                          {story.talent?.image && (
                            <Image
                              src={story.talent.image}
                              alt="Talent"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-xs">
                            {story.talent?.name || "Unknown"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {story.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      {story.isPublished ? (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        {story.isPublished && (
                          <Link
                            href={`/success-stories/${story.slug}`}
                            target="_blank"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View Live"
                            >
                              <Eye className="w-4 h-4 text-slate-500" />
                            </Button>
                          </Link>
                        )}

                        <Link href={`/admin/success-stories/${story.id}/edit`}>
                          <Button variant="ghost" size="icon" title="Edit">
                            <Pencil className="w-4 h-4 text-blue-600" />
                          </Button>
                        </Link>

                        <DeleteStoryButton storyId={story.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
