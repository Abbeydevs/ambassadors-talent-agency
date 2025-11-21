/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, FileAudio, X, FileText } from "lucide-react";
import { getCloudinarySignature } from "@/actions/get-signature";
import { toast } from "sonner";

interface UploadedFile {
  url: string;
  publicId?: string;
}

interface MultiFileUploadProps {
  value: UploadedFile[];
  onChange: (value: UploadedFile[]) => void;
  onRemove: (url: string) => void;
  accept?: string;
  maxFiles?: number;
  type: "image" | "video" | "audio" | "pdf";
}

export const MultiFileUpload = ({
  value = [],
  onChange,
  onRemove,
  accept = "image/*",
  maxFiles = 5,
  type,
}: MultiFileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (value.length + files.length > maxFiles) {
      toast.error(`You can only upload ${maxFiles} files.`);
      return;
    }

    setIsUploading(true);
    const newUploads: UploadedFile[] = [];
    const MAX_SIZE = 10 * 1024 * 1024;

    try {
      for (const file of Array.from(files)) {
        if (file.size > MAX_SIZE) {
          toast.error(`"${file.name}" is too large. Max size is 10MB.`);
          continue;
        }

        const { signature, timestamp } = await getCloudinarySignature(
          "ambassador-talent-media"
        );

        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "api_key",
          process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || ""
        );
        formData.append("signature", signature);
        formData.append("timestamp", timestamp.toString());
        formData.append("folder", "ambassador-talent-media");

        const resourceType =
          type === "audio" ? "video" : type === "pdf" ? "image" : type;

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
          { method: "POST", body: formData }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message);

        newUploads.push({ url: data.secure_url, publicId: data.public_id });
      }

      onChange([...value, ...newUploads]);
      toast.success("Upload complete!");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {value.map((item) => (
            <div
              key={item.url}
              className="relative aspect-square rounded-md overflow-hidden border bg-slate-100 group"
            >
              <div className="absolute right-2 top-2 z-10">
                <Button
                  type="button"
                  onClick={() => onRemove(item.url)}
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {type === "image" && (
                <img
                  src={item.url}
                  alt="Upload"
                  className="object-cover w-full h-full"
                />
              )}
              {type === "video" && (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  controls
                />
              )}
              {type === "audio" && (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-2">
                  <FileAudio className="h-8 w-8 mb-2" />
                  <span className="text-xs break-all text-center">
                    Audio File
                  </span>
                </div>
              )}
              {type === "pdf" && (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-2">
                  <FileText className="h-8 w-8 mb-2" />
                  <span className="text-xs break-all text-center">
                    Document
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button
          type="button"
          disabled={isUploading || value.length >= maxFiles}
          variant="outline"
          onClick={() => document.getElementById(`upload-${type}`)?.click()}
          className="w-full border-dashed border-2 h-20 flex flex-col gap-1"
        >
          {isUploading ? (
            "Uploading..."
          ) : (
            <>
              <ImagePlus className="h-5 w-5" />
              <span>
                Upload {type === "image" ? "Photos" : type} ({value.length}/
                {maxFiles})
              </span>
            </>
          )}
        </Button>
        <input
          id={`upload-${type}`}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          className="hidden"
          onChange={onUpload}
          disabled={isUploading}
        />
      </div>
    </div>
  );
};
