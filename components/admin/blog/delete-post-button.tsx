"use client";

import { useTransition } from "react";
import { deleteBlogPost } from "@/actions/admin/blog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  postId: string;
}

export const DeletePostButton = ({ postId }: Props) => {
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    startTransition(() => {
      deleteBlogPost(postId)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success("Post deleted");
          }
        })
        .catch(() => toast.error("Failed to delete"));
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onDelete}
      disabled={isPending}
      className="text-red-500 hover:text-red-600 hover:bg-red-50"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
};
