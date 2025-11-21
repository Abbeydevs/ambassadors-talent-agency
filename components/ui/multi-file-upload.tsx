/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { X, FileText, FileAudio, UploadCloud, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import axios from "axios";
import { getCloudinarySignature } from "@/actions/get-signature";

interface UploadedFile {
  url: string;
  publicId?: string;
}

interface QueuedFile {
  file: File;
  id: string;
  progress: number;
  preview?: string;
  error?: boolean;
}

interface MultiFileUploadProps {
  value: UploadedFile[];
  onChange: (value: UploadedFile[]) => void;
  onRemove: (url: string) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  type: "image" | "video" | "audio" | "pdf";
}

export const MultiFileUpload = ({
  value = [],
  onChange,
  onRemove,
  accept,
  maxFiles = 5,
  type,
}: MultiFileUploadProps) => {
  const [queuedFiles, setQueuedFiles] = useState<QueuedFile[]>([]);

  const updateProgress = useCallback((id: string, progress: number) => {
    setQueuedFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, progress } : item))
    );
  }, []);

  const removeQueuedFile = useCallback((id: string) => {
    setQueuedFiles((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const uploadFile = useCallback(
    async (queuedFile: QueuedFile) => {
      const MAX_SIZE = 10 * 1024 * 1024;

      if (queuedFile.file.size > MAX_SIZE) {
        removeQueuedFile(queuedFile.id);
        toast.error(`"${queuedFile.file.name}" is too large. Max 10MB.`);
        return;
      }

      try {
        const { signature, timestamp } = await getCloudinarySignature(
          "ambassador-talent-media"
        );

        const formData = new FormData();
        formData.append("file", queuedFile.file);
        formData.append(
          "api_key",
          process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || ""
        );
        formData.append("signature", signature);
        formData.append("timestamp", timestamp.toString());
        formData.append("folder", "ambassador-talent-media");

        const resourceType =
          type === "audio" ? "video" : type === "pdf" ? "image" : type;

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                updateProgress(queuedFile.id, percentCompleted);
              }
            },
          }
        );

        const data = response.data;

        onChange([
          ...value,
          { url: data.secure_url, publicId: data.public_id },
        ]);

        removeQueuedFile(queuedFile.id);
        toast.success("Upload complete");
      } catch (error) {
        console.error(error);
        toast.error(`Failed to upload ${queuedFile.file.name}`);
        removeQueuedFile(queuedFile.id);
      }
    },
    [type, value, onChange, removeQueuedFile, updateProgress]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      fileRejections.forEach((rejection) => {
        toast.error(`${rejection.file.name}: ${rejection.errors[0].message}`);
      });

      if (value.length + queuedFiles.length + acceptedFiles.length > maxFiles) {
        toast.error(`You can only upload ${maxFiles} files.`);
        return;
      }

      const newQueue = acceptedFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substring(7),
        progress: 0,
        preview: type === "image" ? URL.createObjectURL(file) : undefined,
      }));

      setQueuedFiles((prev) => [...prev, ...newQueue]);

      newQueue.forEach((queuedFile) => uploadFile(queuedFile));
    },
    [value.length, queuedFiles.length, maxFiles, type, uploadFile]
  );

  const dropzoneAccept =
    accept ||
    (type === "image"
      ? { "image/*": [] }
      : type === "video"
      ? { "video/*": [] }
      : type === "audio"
      ? { "audio/*": [] }
      : type === "pdf"
      ? { "application/pdf": [] }
      : undefined);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: dropzoneAccept,
    maxFiles,
    disabled: value.length >= maxFiles,
  });

  useEffect(() => {
    return () => {
      queuedFiles.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [queuedFiles]);

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer flex flex-col items-center justify-center text-center gap-2
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-slate-50"
          }
          ${value.length >= maxFiles ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className="p-3 bg-blue-50 rounded-full text-blue-500">
          <UploadCloud className="h-6 w-6" />
        </div>
        <div className="text-sm text-gray-600">
          {isDragActive ? (
            <p className="font-semibold text-blue-600">
              Drop the files here...
            </p>
          ) : (
            <p>
              <span className="font-semibold text-blue-600">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Supported: {type.toUpperCase()} (Max 10MB)
          </p>
        </div>
      </div>

      {queuedFiles.length > 0 && (
        <div className="space-y-3">
          {queuedFiles.map((qFile) => (
            <div
              key={qFile.id}
              className="flex items-center gap-3 p-3 border rounded-md bg-slate-50"
            >
              <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center shrink-0">
                {qFile.preview ? (
                  <img
                    src={qFile.preview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span className="truncate max-w-[150px]">
                    {qFile.file.name}
                  </span>
                  <span>{qFile.progress}%</span>
                </div>
                <Progress value={qFile.progress} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {value.map((item) => (
            <div
              key={item.url}
              className="relative aspect-square rounded-md overflow-hidden border bg-slate-100 group"
            >
              <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition">
                <Button
                  type="button"
                  onClick={() => onRemove(item.url)}
                  variant="destructive"
                  size="icon"
                  className="h-7 w-7"
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
    </div>
  );
};
