"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AnnouncementSchema } from "@/schemas";
import { createAnnouncement } from "@/actions/admin/announcements";
import { toast } from "sonner";
import { Loader2, Send, Megaphone, Users, Mail } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const AnnouncementForm = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AnnouncementSchema>>({
    resolver: zodResolver(AnnouncementSchema),
    defaultValues: {
      title: "",
      message: "",
      audience: "ALL",
      sendAsEmail: false,
    },
  });

  const onSubmit = (values: z.infer<typeof AnnouncementSchema>) => {
    startTransition(() => {
      createAnnouncement(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success(data.success);
            form.reset();
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <Card className="border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#EFF6FF] rounded-lg">
            <Megaphone className="h-5 w-5 text-[#1E40AF]" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-[#111827]">
              Send Announcement
            </CardTitle>
            <CardDescription className="text-xs text-[#6B7280] mt-0.5">
              Broadcast messages to users via dashboard notification
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-[#111827]">
                    Subject / Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. System Maintenance Update"
                      className="border-[#E5E7EB] focus:border-[#1E40AF] focus:ring-[#1E40AF] h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[#EF4444]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-[#111827]">
                    Message Content
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your announcement here..."
                      className="min-h-[140px] border-[#E5E7EB] focus:border-[#1E40AF] focus:ring-[#1E40AF] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[#EF4444]" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="audience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#111827]">
                      Target Audience
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-[#E5E7EB] focus:border-[#1E40AF] focus:ring-[#1E40AF] h-10">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-[#6B7280]" />
                            <SelectValue placeholder="Select audience" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALL">All Users</SelectItem>
                        <SelectItem value="TALENT">Talents Only</SelectItem>
                        <SelectItem value="EMPLOYER">Employers Only</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[#EF4444]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sendAsEmail"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row items-center justify-between rounded-lg border border-[#E5E7EB] p-4 bg-[#F9FAFB]">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-white rounded-md border border-[#E5E7EB]">
                          <Mail className="h-4 w-4 text-[#6B7280]" />
                        </div>
                        <div>
                          <FormLabel className="text-sm font-semibold text-[#111827] cursor-pointer">
                            Send via Email
                          </FormLabel>
                          <p className="text-xs text-[#6B7280] mt-0.5">
                            Also deliver to user inboxes
                          </p>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1E40AF] hover:bg-[#1E3A8A] text-white h-11 font-semibold shadow-sm transition-all hover:shadow"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Send Broadcast
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
