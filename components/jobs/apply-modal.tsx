"use client";

import { useState, useTransition } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApplicationSchema } from "@/schemas";
import { applyToJob } from "@/actions/talent/apply-to-job";
import { toast } from "sonner";
import { TalentProfile, User } from "@prisma/client";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send, CheckCircle2, ArrowRight } from "lucide-react";
import { MultiFileUpload } from "@/components/ui/multi-file-upload";

type FullProfile = TalentProfile & { user: User };

interface ApplyModalProps {
  jobId: string;
  jobTitle: string;
  profile: FullProfile | null;
  hasApplied: boolean;
  children: React.ReactNode;
}

export const ApplyModal = ({
  jobId,
  jobTitle,
  profile,
  hasApplied,
  children,
}: ApplyModalProps) => {
  const [open, setOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // NEW: Track success state
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ApplicationSchema>>({
    resolver: zodResolver(ApplicationSchema),
    defaultValues: {
      coverLetter: "",
      attachments: [],
    },
  });

  const onSubmit = (values: z.infer<typeof ApplicationSchema>) => {
    if (!profile) return;

    startTransition(() => {
      applyToJob(values, jobId)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            // Instead of closing, we switch to success view
            setIsSuccess(true);
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  // Reset state when modal closes/opens
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Delay reset slightly so user doesn't see flash when closing
      setTimeout(() => {
        setIsSuccess(false);
        form.reset();
      }, 300);
    }
  };

  if (hasApplied) return children;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {/* CONDITIONAL RENDERING: Success View vs Form View */}
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-6">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">
                Application Sent!
              </h2>
              <p className="text-slate-500 max-w-sm mx-auto">
                Your application for{" "}
                <span className="font-semibold text-slate-900">{jobTitle}</span>{" "}
                has been submitted successfully. Good luck!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              <Button asChild className="flex-1 bg-[#1E40AF]">
                <Link href="/talent/applications">
                  View My Applications <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Apply for {jobTitle}</DialogTitle>
              <DialogDescription>
                Review your details and add a cover letter to stand out.
              </DialogDescription>
            </DialogHeader>

            {profile && (
              <div className="grid gap-6 py-4">
                {/* User Summary Card */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile.user.image || ""} />
                    <AvatarFallback>{profile.user.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{profile.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {profile.user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {profile.phone}
                    </p>
                  </div>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="coverLetter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover Letter (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Introduce yourself and explain why you're a good fit..."
                              className="h-32 resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Attachments Field */}
                    <FormField
                      control={form.control}
                      name="attachments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Documents (Optional)</FormLabel>
                          <FormControl>
                            <MultiFileUpload
                              type="pdf"
                              maxFiles={2}
                              value={
                                field.value
                                  ? field.value.map((url) => ({ url }))
                                  : []
                              }
                              onChange={(files) =>
                                field.onChange(files.map((f) => f.url))
                              }
                              onRemove={(url) =>
                                field.onChange(
                                  field.value?.filter((u) => u !== url)
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter className="pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-[#1E40AF]"
                      >
                        {isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {!isPending && <Send className="mr-2 h-4 w-4" />}
                        Submit Application
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
