"use client";

import * as z from "zod";
import { useForm, useWatch } from "react-hook-form"; // Import useWatch
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSettingsSchema } from "@/schemas";
import { updateProfileSettings } from "@/actions/talent/update-settings";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useTransition } from "react";
import { toast } from "sonner";
import { TalentProfile } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Globe, Lock, Eye } from "lucide-react";
import Link from "next/link";

type FormValues = z.infer<typeof ProfileSettingsSchema>;

interface ProfileSettingsFormProps {
  initialData?: TalentProfile | null;
}

export const ProfileSettingsForm = ({
  initialData,
}: ProfileSettingsFormProps) => {
  const [isPending, startTransition] = useTransition();

  const contactVisibility = initialData?.contactInfoVisibility
    ? typeof initialData.contactInfoVisibility === "string"
      ? JSON.parse(initialData.contactInfoVisibility)
      : initialData.contactInfoVisibility
    : { showEmail: false, showPhone: false };

  const form = useForm<FormValues>({
    resolver: zodResolver(ProfileSettingsSchema),
    defaultValues: {
      profileVisibility: initialData?.profileVisibility || "PUBLIC",
      contactInfoVisibility: {
        showEmail: contactVisibility.showEmail || false,
        showPhone: contactVisibility.showPhone || false,
      },
    },
    mode: "onChange",
  });

  const profileVisibility = useWatch({
    control: form.control,
    name: "profileVisibility",
  });

  useAutoSave(form, async (values) => {
    const result = await updateProfileSettings(values);
    return { success: result.success, error: result.error };
  });

  const onSubmit = (values: FormValues) => {
    startTransition(() => {
      updateProfileSettings(values)
        .then((data) => {
          if (data.error) toast.error(data.error);
          else toast.success("Settings saved!");
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const completionScore = initialData?.profileCompletion || 0;

  return (
    <div className="space-y-8 max-w-3xl">
      <Card className="border-l-4 border-l-[#1E40AF]">
        <CardHeader>
          <CardTitle className="text-lg">
            Profile Strength: {completionScore}%
          </CardTitle>
          <CardDescription>
            Complete profiles get 3x more views from employers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={completionScore} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">
            {completionScore < 100
              ? "Tip: Add more media and experience to reach 100%."
              : "Great job! Your profile is fully optimized."}
          </p>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Visibility</h3>
            <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  {profileVisibility === "PUBLIC" ? (
                    <span className="flex items-center gap-2 text-green-600">
                      <Globe className="h-4 w-4" /> Public Profile
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-amber-600">
                      <Lock className="h-4 w-4" /> Private Profile
                    </span>
                  )}
                </FormLabel>
                <FormDescription>
                  {profileVisibility === "PUBLIC"
                    ? "Your profile is visible to employers and searchable."
                    : "Your profile is hidden. You can still apply to jobs manually."}
                </FormDescription>
              </div>
              <FormField
                control={form.control}
                name="profileVisibility"
                render={({ field }) => (
                  <FormControl>
                    <Switch
                      checked={field.value === "PUBLIC"}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? "PUBLIC" : "PRIVATE")
                      }
                    />
                  </FormControl>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="contactInfoVisibility.showEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Show Email Address
                      </FormLabel>
                      <FormDescription>
                        Allow verified employers to see your email.
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

              <FormField
                control={form.control}
                name="contactInfoVisibility.showPhone"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Show Phone Number
                      </FormLabel>
                      <FormDescription>
                        Allow verified employers to see your phone number.
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
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" asChild>
              <Link href="/talent/profile/preview" target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                Preview Public Profile
              </Link>
            </Button>

            <Button type="submit" disabled={isPending} className="bg-[#1E40AF]">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Settings
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
