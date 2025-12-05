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
import {
  Loader2,
  Send,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
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
  const [isSuccess, setIsSuccess] = useState(false);
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
            setIsSuccess(true);
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
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
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[#10B981]/20 rounded-full animate-ping"></div>
              <div className="relative h-24 w-24 bg-linear-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center shadow-xl shadow-[#10B981]/30">
                <CheckCircle2 className="h-12 w-12 text-white" />
              </div>
            </div>

            <div className="space-y-3 max-w-md">
              <h2 className="text-3xl font-bold text-[#111827]">
                Application Sent! 🎉
              </h2>
              <p className="text-[#6B7280] text-base leading-relaxed">
                Your application for{" "}
                <span className="font-semibold text-[#1E40AF]">{jobTitle}</span>{" "}
                has been submitted successfully. The employer will review your
                profile and get back to you soon.
              </p>
            </div>

            <div className="w-full max-w-md p-4 bg-[#F0FDF4] border border-[#10B981]/20 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#10B981]/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-[#10B981]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#065F46] mb-1">
                    What happens next?
                  </p>
                  <p className="text-xs text-[#047857]">
                    You&apos;ll receive notifications about your application
                    status. Meanwhile, keep exploring more opportunities!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-2">
              <Button
                variant="outline"
                className="flex-1 border-[#E5E7EB] hover:bg-[#F9FAFB]"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              <Button
                asChild
                className="flex-1 bg-[#1E40AF] hover:bg-[#1E40AF]/90 shadow-lg shadow-[#1E40AF]/20"
              >
                <Link href="/talent/applications">
                  View Applications
                  <ArrowRight className="ml-2 h-4 w-4" />
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
