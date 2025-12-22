"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SystemSettingsSchema } from "@/schemas";
import { updateSystemSettings } from "@/actions/admin/settings";
import { toast } from "sonner";
import { SystemSettings } from "@prisma/client";
import { Loader2, Save, Globe, Share2, Scale, Mail } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmailTemplate {
  subject: string;
  body: string;
}

interface EmailTemplatesConfig {
  welcome?: EmailTemplate;
  application_received?: EmailTemplate;
  hired?: EmailTemplate;
}

interface SettingsFormProps {
  initialData: SystemSettings;
}

export const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const [isPending, startTransition] = useTransition();
  const rawTemplates = initialData.emailTemplates as unknown;
  const emailTemplates = (rawTemplates as EmailTemplatesConfig) || {};

  const defaultEmails = {
    welcome: emailTemplates.welcome || { subject: "", body: "" },
    application_received: emailTemplates.application_received || {
      subject: "",
      body: "",
    },
    hired: emailTemplates.hired || { subject: "", body: "" },
  };

  const form = useForm<z.infer<typeof SystemSettingsSchema>>({
    resolver: zodResolver(SystemSettingsSchema),
    defaultValues: {
      siteName: initialData.siteName,
      supportEmail: initialData.supportEmail,
      maintenanceMode: initialData.maintenanceMode,
      facebookUrl: initialData.facebookUrl || "",
      instagramUrl: initialData.instagramUrl || "",
      twitterUrl: initialData.twitterUrl || "",
      linkedinUrl: initialData.linkedinUrl || "",
      termsOfService: initialData.termsOfService || "",
      privacyPolicy: initialData.privacyPolicy || "",
      cookiePolicy: initialData.cookiePolicy || "",
      emailTemplates: defaultEmails,
    },
  });

  const onSubmit = (values: z.infer<typeof SystemSettingsSchema>) => {
    startTransition(() => {
      updateSystemSettings(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success(data.success);
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header with Save Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Platform Configuration
            </h2>
            <p className="text-muted-foreground">
              Manage your site settings, legal content, and automated emails.
            </p>
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="general">
              <Globe className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="social">
              <Share2 className="h-4 w-4 mr-2" />
              Social
            </TabsTrigger>
            <TabsTrigger value="legal">
              <Scale className="h-4 w-4 mr-2" />
              Legal
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              Emails
            </TabsTrigger>
          </TabsList>

          {/* 1. GENERAL SETTINGS */}
          <TabsContent value="general" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>
                  Basic details about your platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="siteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ambassador Talent Agency"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supportEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Email</FormLabel>
                      <FormControl>
                        <Input placeholder="support@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        This email is displayed to users who need help.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maintenanceMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Maintenance Mode
                        </FormLabel>
                        <FormDescription>
                          Disable public access to the site (Admins can still
                          login).
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 2. SOCIAL LINKS */}
          <TabsContent value="social" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>
                  These links will appear in your website footer.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="facebookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://facebook.com/..."
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instagramUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://instagram.com/..."
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="twitterUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter (X) URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://twitter.com/..."
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/..."
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 3. LEGAL PAGES */}
          <TabsContent value="legal" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Legal Pages</CardTitle>
                <CardDescription>
                  Edit the content for your Terms and Privacy pages.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="termsOfService"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms of Service</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[200px] font-mono text-sm"
                          placeholder="Enter your Terms of Service here..."
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="privacyPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Privacy Policy</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[200px] font-mono text-sm"
                          placeholder="Enter your Privacy Policy here..."
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 4. EMAIL TEMPLATES */}
          <TabsContent value="email" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>
                  Customize the automated emails sent by the system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Welcome Email */}
                <div className="border p-4 rounded-lg bg-slate-50">
                  <h3 className="font-semibold text-slate-900 mb-3">
                    Welcome Email
                  </h3>
                  <div className="grid gap-3">
                    <FormItem>
                      <FormLabel>Subject Line</FormLabel>
                      <Input
                        {...form.register("emailTemplates.welcome.subject")}
                      />
                    </FormItem>
                    <FormItem>
                      <FormLabel>Body Content</FormLabel>
                      <Textarea
                        {...form.register("emailTemplates.welcome.body")}
                        className="min-h-[100px]"
                      />
                    </FormItem>
                  </div>
                </div>

                {/* Application Received */}
                <div className="border p-4 rounded-lg bg-slate-50">
                  <h3 className="font-semibold text-slate-900 mb-3">
                    Application Received
                  </h3>
                  <div className="grid gap-3">
                    <FormItem>
                      <FormLabel>Subject Line</FormLabel>
                      <Input
                        {...form.register(
                          "emailTemplates.application_received.subject"
                        )}
                      />
                    </FormItem>
                    <FormItem>
                      <FormLabel>Body Content</FormLabel>
                      <Textarea
                        {...form.register(
                          "emailTemplates.application_received.body"
                        )}
                        className="min-h-[100px]"
                      />
                    </FormItem>
                  </div>
                </div>

                {/* Hired Email */}
                <div className="border p-4 rounded-lg bg-slate-50">
                  <h3 className="font-semibold text-slate-900 mb-3">
                    Hired Notification
                  </h3>
                  <div className="grid gap-3">
                    <FormItem>
                      <FormLabel>Subject Line</FormLabel>
                      <Input
                        {...form.register("emailTemplates.hired.subject")}
                      />
                    </FormItem>
                    <FormItem>
                      <FormLabel>Body Content</FormLabel>
                      <Textarea
                        {...form.register("emailTemplates.hired.body")}
                        className="min-h-[100px]"
                      />
                    </FormItem>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
};
