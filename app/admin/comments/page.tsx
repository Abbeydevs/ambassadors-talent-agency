import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeleteCommentButton } from "@/components/admin/comments/delete-comment-button";
import { ExternalLink } from "lucide-react";

export default async function AdminCommentsPage() {
  const comments = await db.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      post: {
        select: { title: true, slug: true },
      },
    },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comments</h1>
          <p className="text-slate-500">
            Manage user discussion across all posts.
          </p>
        </div>
        <div className="bg-slate-100 px-4 py-2 rounded-lg text-sm font-medium text-slate-600">
          Total: {comments.length}
        </div>
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead className="w-[400px]">Comment</TableHead>
              <TableHead>Post</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-slate-500"
                >
                  No comments found yet.
                </TableCell>
              </TableRow>
            ) : (
              comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user.image || ""} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">
                        {comment.user.name || "Anonymous"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <p
                      className="text-sm text-slate-600 line-clamp-2"
                      title={comment.content}
                    >
                      {comment.content}
                    </p>
                  </TableCell>

                  <TableCell>
                    {comment.post ? (
                      <Link
                        href={`/blog/${comment.post.slug}`}
                        target="_blank"
                        className="flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium"
                      >
                        {comment.post.title.substring(0, 20)}...
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    ) : (
                      <span className="text-slate-400 text-xs">
                        Deleted Post
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="text-slate-500 text-sm whitespace-nowrap">
                    {format(new Date(comment.createdAt), "MMM d, HH:mm")}
                  </TableCell>

                  <TableCell className="text-right">
                    <DeleteCommentButton commentId={comment.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
