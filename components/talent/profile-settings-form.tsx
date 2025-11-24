"use client";

import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
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
import {
  Loader2,
  Globe,
  Lock,
  Eye,
  Mail,
  Phone,
  TrendingUp,
  CheckCircle2,
  Save,
} from "lucide-react";
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
    <div className="space-y-8">
      {/* Profile Strength Card */}
      <Card className="border-2 border-indigo-100 bg-linear-to-br from-indigo-50/50 to-purple-50/50 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                Profile Strength: {completionScore}%
              </CardTitle>
              <CardDescription className="text-sm">
                Complete profiles get 3x more views from employers
              </CardDescription>
            </div>
            <div className="text-right">
              {completionScore === 100 ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  Complete!
                </div>
              ) : (
                <div className="text-3xl font-bold text-indigo-600">
                  {completionScore}
                  <span className="text-sm text-gray-500">/100</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={completionScore} className="h-3 bg-white/50" />
          <p className="text-xs text-gray-600">
            {completionScore < 100 ? (
              <span className="flex items-center gap-2">
                💡 <strong>Tip:</strong> Add more media and experience to reach
                100% and maximize your visibility.
              </span>
            ) : (
              <span className="flex items-center gap-2 text-green-600">
                🎉 <strong>Great job!</strong> Your profile is fully optimized.
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Visibility Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <div className="h-1 w-1 rounded-full bg-indigo-600"></div>
              <h3 className="font-semibold text-gray-900">
                Profile Visibility
              </h3>
            </div>

            <Card
              className={`border-2 transition-all ${
                profileVisibility === "PUBLIC"
                  ? "border-green-200 bg-green-50/50"
                  : "border-amber-200 bg-amber-50/50"
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex flex-row items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <FormLabel className="text-lg font-semibold">
                      {profileVisibility === "PUBLIC" ? (
                        <span className="flex items-center gap-2 text-green-700">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Globe className="h-5 w-5" />
                          </div>
                          Public Profile
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-amber-700">
                          <div className="p-2 bg-amber-100 rounded-lg">
                            <Lock className="h-5 w-5" />
                          </div>
                          Private Profile
                        </span>
                      )}
                    </FormLabel>
                    <FormDescription className="text-sm">
                      {profileVisibility === "PUBLIC"
                        ? "✅ Your profile is visible to all employers and searchable in the talent directory."
                        : "⚠️ Your profile is hidden from search. You can still apply to jobs manually."}
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
                          className="data-[state=checked]:bg-green-600"
                        />
                      </FormControl>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <div className="h-1 w-1 rounded-full bg-indigo-600"></div>
              <h3 className="font-semibold text-gray-900">
                Contact Information Privacy
              </h3>
            </div>

            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="contactInfoVisibility.showEmail"
                render={({ field }) => (
                  <FormItem>
                    <Card className="border-2 hover:border-indigo-200 hover:shadow-md transition-all">
                      <CardContent className="pt-6">
                        <div className="flex flex-row items-center justify-between">
                          <div className="space-y-2 flex-1">
                            <FormLabel className="text-base font-semibold flex items-center gap-2">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <Mail className="h-4 w-4 text-blue-600" />
                              </div>
                              Show Email Address
                            </FormLabel>
                            <FormDescription className="text-sm text-gray-600">
                              Allow verified employers to see your email address
                              on your profile
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-indigo-600"
                            />
                          </FormControl>
                        </div>
                      </CardContent>
                    </Card>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactInfoVisibility.showPhone"
                render={({ field }) => (
                  <FormItem>
                    <Card className="border-2 hover:border-indigo-200 hover:shadow-md transition-all">
                      <CardContent className="pt-6">
                        <div className="flex flex-row items-center justify-between">
                          <div className="space-y-2 flex-1">
                            <FormLabel className="text-base font-semibold flex items-center gap-2">
                              <div className="p-2 bg-purple-50 rounded-lg">
                                <Phone className="h-4 w-4 text-purple-600" />
                              </div>
                              Show Phone Number
                            </FormLabel>
                            <FormDescription className="text-sm text-gray-600">
                              Allow verified employers to see your phone number
                              on your profile
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-indigo-600"
                            />
                          </FormControl>
                        </div>
                      </CardContent>
                    </Card>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
            <Button variant="outline" asChild>
              <Link href={`/profile/${initialData?.userId}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                Preview Public Profile
              </Link>
            </Button>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Auto-save enabled</span>
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 h-11 px-8 w-full sm:w-auto"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
