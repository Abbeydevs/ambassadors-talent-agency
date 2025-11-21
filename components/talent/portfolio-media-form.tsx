/* eslint-disable jsx-a11y/alt-text */
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
import {
  Loader2,
  Save,
  CheckCircle2,
  Image,
  Video,
  Music,
  FileText,
  Link as LinkIcon,
} from "lucide-react";

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* Photos Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b">
            <div className="h-1 w-1 rounded-full bg-pink-600"></div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Image className="h-5 w-5 text-pink-600" />
              Photos
            </h3>
          </div>

          <FormField
            control={form.control}
            name="photos"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  Portfolio Images
                </FormLabel>
                <FormDescription className="text-xs">
                  Upload headshots and portfolio images. High-quality photos
                  increase your chances of getting hired. (Max 10 images)
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
        </div>

        {/* Videos Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b">
            <div className="h-1 w-1 rounded-full bg-pink-600"></div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Video className="h-5 w-5 text-purple-600" />
              Videos
            </h3>
          </div>

          <FormField
            control={form.control}
            name="videos"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  Showreels & Demo Tapes
                </FormLabel>
                <FormDescription className="text-xs">
                  Upload your best video work. Showreels should be 1-3 minutes
                  long for maximum impact. (Max 3 videos)
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
        </div>

        {/* Audio Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b">
            <div className="h-1 w-1 rounded-full bg-pink-600"></div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Music className="h-5 w-5 text-blue-600" />
              Audio Samples
            </h3>
          </div>

          <FormField
            control={form.control}
            name="audioSamples"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  Voice-overs & Music Samples
                </FormLabel>
                <FormDescription className="text-xs">
                  Upload voice-over demos, singing samples, or instrumental
                  recordings. (Max 3 audio files)
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
        </div>

        {/* Resume Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b">
            <div className="h-1 w-1 rounded-full bg-pink-600"></div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-600" />
              Resume / CV
            </h3>
          </div>

          <FormField
            control={form.control}
            name="resume"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  Professional Resume
                </FormLabel>
                <FormDescription className="text-xs">
                  Upload your CV as a PDF document. Include your experience,
                  training, and achievements.
                  <span className="block text-amber-600 font-medium mt-1">
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
        </div>

        {/* External Links Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b">
            <div className="h-1 w-1 rounded-full bg-pink-600"></div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-indigo-600" />
              External Links
            </h3>
          </div>

          <FormField
            control={form.control}
            name="externalPortfolioLinks"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  Portfolio & Social Media Links
                </FormLabel>
                <FormDescription className="text-xs">
                  Add links to your YouTube channel, Vimeo portfolio, personal
                  website, Instagram, or other platforms where employers can see
                  more of your work.
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
        </div>

        {/* Tips Section */}
        <div className="bg-linear-to-br from-pink-50 to-purple-50 border-2 border-pink-100 rounded-xl p-6">
          <div className="flex gap-4">
            <div className="shrink-0">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">
                Pro Tips for Your Portfolio
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Use high-resolution images (at least 1920x1080)</li>
                <li>Keep videos short and engaging (1-3 minutes)</li>
                <li>Showcase your range with diverse samples</li>
                <li>Update your portfolio regularly with recent work</li>
                <li>Ensure all links are working and up-to-date</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Auto-save enabled</span>
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 h-11 px-8"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
