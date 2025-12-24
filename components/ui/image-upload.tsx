/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash, Loader2, Upload } from "lucide-react";
import { getCloudinarySignature } from "@/actions/get-signature";
import { toast } from "sonner";
import { Input } from "./input";

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
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong with the upload.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerClasses =
    variant === "avatar"
      ? "flex flex-col gap-4 items-center justify-center"
      : "flex flex-col gap-4 items-start";

  const imageContainerClasses =
    variant === "avatar"
      ? "h-40 w-40 rounded-full border-4 border-gray-200"
      : "w-full aspect-video rounded-xl max-h-[300px] border-2 border-gray-200";

  return (
    <div className={containerClasses}>
      <div
        className={`relative overflow-hidden shadow-md bg-gray-100 ${imageContainerClasses}`}
      >
        {value ? (
          <div className="relative h-full w-full group">
            <img
              src={value}
              alt="Upload"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Button
                type="button"
                onClick={() => onRemove(value)}
                variant="destructive"
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg bg-red-600 hover:bg-red-700 transform scale-90 group-hover:scale-100 transition-transform"
              >
                <Trash className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 text-gray-400">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <p className="text-sm font-medium text-gray-600">
                  Uploading...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <ImagePlus className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-500">
                  {variant === "avatar" ? "No photo" : "No image"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          disabled={disabled || isLoading}
          variant="outline"
          onClick={() => document.getElementById("imageInput")?.click()}
          className="bg-white border-gray-200 hover:bg-gray-50 text-gray-900 font-medium shadow-sm"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isLoading
            ? "Uploading..."
            : variant === "avatar"
            ? "Change Photo"
            : "Upload Image"}
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
