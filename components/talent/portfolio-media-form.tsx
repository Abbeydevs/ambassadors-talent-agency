"use client";

import * as z from "zod";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PortfolioMediaSchema } from "@/schemas";
import { updatePortfolioMedia } from "@/actions/talent/update-media";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  TalentProfile,
  PortfolioPhoto,
  PortfolioVideo,
  PortfolioAudio,
  PortfolioDocument,
} from "@prisma/client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { MultiFileUpload } from "@/components/ui/multi-file-upload";
import { LinkManager } from "@/components/ui/link-manager";
import { Loader2 } from "lucide-react";

type FormValues = z.infer<typeof PortfolioMediaSchema>;

type SocialLink = {
  platform: string;
  url: string;
};

type FullProfile = TalentProfile & {
  photos: PortfolioPhoto[];
  videos: PortfolioVideo[];
  audioSamples: PortfolioAudio[];
  documents: PortfolioDocument[];
};

interface PortfolioMediaFormProps {
  initialData?: FullProfile | null;
}

export const PortfolioMediaForm = ({
  initialData,
}: PortfolioMediaFormProps) => {
  const [isPending, startTransition] = useTransition();

  const parsedSocialLinks = initialData?.socialMediaLinks
    ? ((typeof initialData.socialMediaLinks === "string"
        ? JSON.parse(initialData.socialMediaLinks)
        : initialData.socialMediaLinks) as SocialLink[])
    : [];

  const form = useForm<FormValues>({
    resolver: zodResolver(PortfolioMediaSchema) as Resolver<FormValues>,
    defaultValues: {
      photos:
        initialData?.photos.map((p) => ({
          url: p.url,
          publicId: p.publicId || "",
        })) || [],
      videos:
        initialData?.videos.map((v) => ({
          url: v.url,
          publicId: v.publicId || "",
        })) || [],
      audioSamples:
        initialData?.audioSamples.map((a) => ({
          url: a.url,
          publicId: a.publicId || "",
        })) || [],
      resume: initialData?.documents[0]?.url || "",
      externalPortfolioLinks: initialData?.externalPortfolioLinks || [],
      // FIX: Use the safely parsed and typed variable
      socialMediaLinks: parsedSocialLinks,
    },
    mode: "onChange",
  });

  useAutoSave(form, async (values) => {
    const result = await updatePortfolioMedia(values);
    return { success: result.success, error: result.error };
  });

  const onSubmit = (values: FormValues) => {
    startTransition(() => {
      updatePortfolioMedia(values)
        .then((data) => {
          if (data.error) toast.error(data.error);
          else toast.success("Media updated!");
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-10 max-w-4xl"
      >
        {/* Photos */}
        <FormField
          control={form.control}
          name="photos"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Photos</FormLabel>
              <FormDescription>
                Upload headshots and portfolio images (Max 10).
              </FormDescription>
              <MultiFileUpload
                type="image"
                maxFiles={10}
                value={field.value || []}
                onChange={field.onChange}
                onRemove={(url) =>
                  field.onChange(field.value?.filter((i) => i.url !== url))
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Videos */}
        <FormField
          control={form.control}
          name="videos"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Videos</FormLabel>
              <FormDescription>
                Showreels and demo tapes (Max 3).
              </FormDescription>
              <MultiFileUpload
                type="video"
                maxFiles={3}
                value={field.value || []}
                onChange={field.onChange}
                onRemove={(url) =>
                  field.onChange(field.value?.filter((i) => i.url !== url))
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Audio */}
        <FormField
          control={form.control}
          name="audioSamples"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">
                Audio Samples
              </FormLabel>
              <FormDescription>
                Voice-overs and music samples (Max 3).
              </FormDescription>
              <MultiFileUpload
                type="audio"
                maxFiles={3}
                value={field.value || []}
                onChange={field.onChange}
                onRemove={(url) =>
                  field.onChange(field.value?.filter((i) => i.url !== url))
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Resume */}
        <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">
                Resume / CV
              </FormLabel>
              <FormDescription>
                Upload your CV as a PDF.
                <span className="block text-xs text-amber-600 font-medium mt-1">
                  Max file size: 10MB
                </span>
              </FormDescription>
              <MultiFileUpload
                type="pdf"
                maxFiles={1}
                value={field.value ? [{ url: field.value }] : []}
                onChange={(files) => field.onChange(files[0]?.url || "")}
                onRemove={() => field.onChange("")}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* External Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="externalPortfolioLinks"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  External Links
                </FormLabel>
                <FormDescription>
                  Links to YouTube, Vimeo, or personal website.
                </FormDescription>
                <LinkManager
                  links={field.value || []}
                  onChange={field.onChange}
                  placeholder="https://youtube.com/..."
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Social Links - Simplified to just URLs for now */}
          {/* Note: We removed the complex object logic for now to keep it simple with LinkManager, 
                but if you want platform selectors, we can add them back. 
                For now, the schema expects objects but LinkManager returns strings. 
                We might need to adjust the schema or the UI to match. 
                
                Since LinkManager returns strings [], and schema expects {platform, url}[], 
                we should probably just use externalPortfolioLinks for now to avoid complexity,
                OR update LinkManager to handle objects.
                
                To keep moving fast, I'll comment this out until we build a 'SocialLinkManager' component.
            */}
          {/* <FormField
              control={form.control}
              name="socialMediaLinks"
              render={({ field }) => (
                 // Complex UI needed here
              )}
            /> 
            */}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending} className="bg-[#1E40AF]">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};
