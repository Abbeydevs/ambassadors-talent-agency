/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash, Loader2 } from "lucide-react";
import { getCloudinarySignature } from "@/actions/get-signature";
import { toast } from "sonner";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string;
  variant?: "avatar" | "cover";
}

export const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
  variant = "avatar",
}: ImageUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    try {
      const { signature, timestamp } = await getCloudinarySignature();

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "api_key",
        process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || ""
      );
      formData.append("signature", signature);
      formData.append("timestamp", timestamp.toString());
      formData.append("folder", "ambassador-talent-profiles");

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Upload failed");
      }

      onChange(data.secure_url);
      toast.success("Image uploaded!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong with the upload.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        variant === "avatar" ? "items-center justify-center" : "items-start"
      )}
    >
      {/* 1. The Container (Circle vs Rectangle) */}
      <div
        className={cn(
          "relative overflow-hidden border-4 border-white/20 shadow-xl bg-slate-100",
          variant === "avatar"
            ? "h-40 w-40 rounded-full"
            : "w-full aspect-video rounded-lg max-h-[300px] object-cover"
        )}
      >
        {value ? (
          <div className="relative h-full w-full">
            <img
              src={value}
              alt="Upload"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                onClick={() => onRemove(value)}
                variant="destructive"
                size="icon"
                className="h-10 w-10 rounded-full"
              >
                <Trash className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-slate-200 text-slate-400">
            {isLoading ? (
              <Loader2 className="h-10 w-10 animate-spin" />
            ) : (
              <ImagePlus className="h-10 w-10" />
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="button"
          disabled={disabled || isLoading}
          variant="outline"
          onClick={() => document.getElementById("imageInput")?.click()}
          className="bg-white/10 border-white/20 hover:bg-white/20 text-slate-900"
        >
          {isLoading
            ? "Uploading..."
            : variant === "avatar"
            ? "Change Photo"
            : "Upload Cover Image"}
        </Button>
        <Input
          id="imageInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onUpload}
          disabled={disabled || isLoading}
        />
      </div>
    </div>
  );
};
