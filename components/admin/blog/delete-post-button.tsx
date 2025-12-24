"use client";

import { useTransition } from "react";
import { deleteBlogPost } from "@/actions/admin/blog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  postId: string;
}

export const DeletePostButton = ({ postId }: Props) => {
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(() => {
      deleteBlogPost(postId)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success("Post deleted successfully");
          }
        })
        .catch(() => toast.error("Failed to delete post"));
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg"
          title="Delete"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-gray-900">
            Delete this article?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            This will permanently delete the post and all its comments. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-gray-200">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Delete Post
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
