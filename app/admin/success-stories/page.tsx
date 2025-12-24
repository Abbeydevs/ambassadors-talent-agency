import Link from "next/link";
import Image from "next/image";
import { getAdminStories } from "@/data/success-stories";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Pencil,
  Eye,
  Star,
  BookOpen,
  CheckCircle,
  FileEdit,
} from "lucide-react";
import { DeleteStoryButton } from "@/components/admin/success-stories/delete-button";

export default async function AdminStoriesPage() {
  const stories = await getAdminStories();

  const publishedCount = stories.filter((s) => s.isPublished).length;
  const draftCount = stories.filter((s) => !s.isPublished).length;
  const featuredCount = stories.filter((s) => s.featured).length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-indigo-600" />
            </div>
            Success Stories
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Manage and curate inspiring talent success stories
          </p>
        </div>
        <Link href="/admin/success-stories/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create New Story
          </Button>
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Total Stories</p>
            <div className="h-8 w-8 bg-gray-50 rounded-lg flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stories.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Published</p>
            <div className="h-8 w-8 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">{publishedCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Drafts</p>
            <div className="h-8 w-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <FileEdit className="h-4 w-4 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-amber-600">{draftCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Featured</p>
            <div className="h-8 w-8 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{featuredCount}</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="bg-linear-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
              <tr>
                <th className="h-12 px-4 align-middle font-semibold text-gray-900">
                  Cover
                </th>
                <th className="h-12 px-4 align-middle font-semibold text-gray-900">
                  Title
                </th>
                <th className="h-12 px-4 align-middle font-semibold text-gray-900">
                  Talent
                </th>
                <th className="h-12 px-4 align-middle font-semibold text-gray-900">
                  Status
                </th>
                <th className="h-12 px-4 align-middle font-semibold text-gray-900 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {stories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <BookOpen className="h-12 w-12 mb-2 text-gray-300" />
                      <p className="font-medium">No stories found</p>
                      <p className="text-sm text-gray-400">
                        Click &quot;Create New Story&quot; to add one
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                stories.map((story) => (
                  <tr
                    key={story.id}
                    className="border-b border-gray-100 hover:bg-blue-50/30 transition-all duration-200"
                  >
                    <td className="p-4 align-middle">
                      <div className="relative h-16 w-24 rounded-lg overflow-hidden bg-gray-100 shadow-sm border border-gray-200">
                        {story.coverImage ? (
                          <Image
                            src={story.coverImage}
                            alt={story.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs text-gray-400 font-medium">
                            No Image
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-sm text-gray-900">
                          {story.title}
                        </span>
                        {story.featured && (
                          <span className="inline-flex items-center w-fit rounded-full border border-yellow-200 bg-yellow-50 px-2 py-0.5 text-xs font-semibold text-yellow-700">
                            <Star className="w-3 h-3 mr-1 fill-yellow-600" />
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm ring-2 ring-gray-100">
                          {story.talent?.image ? (
                            <Image
                              src={story.talent.image}
                              alt="Talent"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-xs text-gray-400">
                              {story.talent?.name?.charAt(0)?.toUpperCase() ||
                                "?"}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-gray-900">
                            {story.talent?.name || "Unknown"}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            {story.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      {story.isPublished ? (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 border border-green-200 shadow-sm">
                          <CheckCircle className="h-3 w-3 mr-1.5" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 border border-gray-200 shadow-sm">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-1">
                        {story.isPublished && (
                          <Link
                            href={`/success-stories/${story.slug}`}
                            target="_blank"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View Live"
                              className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        )}

                        <Link href={`/admin/success-stories/${story.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit"
                            className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg"
                          >
                            <Pencil className="w-4 h-4" />
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

      {/* FOOTER */}
      {stories.length > 0 && (
        <div className="flex items-center justify-between text-sm bg-white border border-gray-200 rounded-lg px-5 py-3">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {stories.length}
            </span>{" "}
            success stories
          </p>
        </div>
      )}
    </div>
  );
}
