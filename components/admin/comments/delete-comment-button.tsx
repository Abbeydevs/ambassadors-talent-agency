"use client";

import { useTransition } from "react";
import { deleteComment } from "@/actions/admin/comments";
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
  commentId: string;
}

export const DeleteCommentButton = ({ commentId }: Props) => {
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(() => {
      deleteComment(commentId)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success("Comment deleted");
          }
        })
        .catch(() => toast.error("Failed to delete"));
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            user&apos;s comment from the article.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Delete Comment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
