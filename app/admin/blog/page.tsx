import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PlusCircle,
  Pencil,
  Eye,
  FileText,
  CheckCircle,
  FileEdit,
} from "lucide-react";
import { DeletePostButton } from "@/components/admin/blog/delete-post-button";

export default async function AdminBlogPage() {
  const posts = await db.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  const publishedCount = posts.filter((p) => p.isPublished).length;
  const draftCount = posts.filter((p) => !p.isPublished).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            Blog Posts
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Manage your articles, drafts, and content
          </p>
        </div>
        <Link href="/admin/blog/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Post
          </Button>
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Total Posts</p>
            <div className="h-8 w-8 bg-gray-50 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{posts.length}</p>
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
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-linear-to-r from-gray-50 to-gray-100/50 hover:bg-linear-to-r hover:from-gray-50 hover:to-gray-100/50 border-b border-gray-200">
              <TableHead className="font-semibold text-gray-900 py-4">
                Title
              </TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">
                Category
              </TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">
                Date
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-900 py-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <FileText className="h-12 w-12 mb-2 text-gray-300" />
                    <p className="font-medium">No posts found</p>
                    <p className="text-sm text-gray-400">
                      Create your first blog post to get started
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow
                  key={post.id}
                  className="border-b border-gray-100 hover:bg-blue-50/30 transition-all duration-200"
                >
                  <TableCell className="py-4">
                    <div className="font-semibold text-sm text-gray-900 max-w-[400px] truncate">
                      {post.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    {post.isPublished ? (
                      <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border border-green-200 shadow-sm font-medium">
                        <CheckCircle className="h-3 w-3 mr-1.5" />
                        Published
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200 shadow-sm font-medium"
                      >
                        Draft
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {post.category?.name ? (
                      <span className="text-sm text-gray-700 font-medium">
                        {post.category.name}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400 italic">
                        Uncategorized
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-700 text-sm font-medium">
                    {format(new Date(post.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {post.isPublished && (
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Live"
                            className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}

                      <Link href={`/admin/blog/${post.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit"
                          className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>

                      <DeletePostButton postId={post.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results footer */}
      {posts.length > 0 && (
        <div className="flex items-center justify-between text-sm bg-white border border-gray-200 rounded-lg px-5 py-3">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">{posts.length}</span>{" "}
            blog posts
          </p>
        </div>
      )}
    </div>
  );
}
