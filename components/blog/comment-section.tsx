/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CommentSchema } from "@/schemas";
import { createComment } from "@/actions/comments";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Send, Loader2, UserCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";

interface CommentData {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface CommentSectionProps {
  postId: string;
  comments: CommentData[];
  currentUser: { id: string; image?: string | null } | null;
}

export const CommentSection = ({
  postId,
  comments,
  currentUser,
}: CommentSectionProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      content: "",
      postId: postId,
    },
  });

  const contentValue = form.watch("content");

  const onSubmit = (values: z.infer<typeof CommentSchema>) => {
    startTransition(() => {
      createComment(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success(data.success);
            form.reset();
            router.refresh();
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-slate-900">
        Comments ({comments.length})
      </h3>

      {currentUser ? (
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser.image || ""} />
            <AvatarFallback>Me</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Share your thoughts..."
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isPending || !contentValue?.trim()}
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Post Comment
                </Button>
              </form>
            </Form>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 p-6 rounded-lg text-center border">
          <p className="text-slate-600 mb-2">
            Log in to join the conversation.
          </p>
          <Button variant="outline" onClick={() => router.push("/auth/login")}>
            Sign In
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={comment.user.image || ""} />
              <AvatarFallback>
                <UserCircle2 className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">
                  {comment.user.name}
                </span>
                <span className="text-xs text-slate-500">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
