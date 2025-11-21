/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import {
  X,
  FileText,
  FileAudio,
  UploadCloud,
  Loader2,
  CheckCircle2,
  Image as ImageIcon,
  Video,
  Music,
  FileType,
} from "lucide-react";
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

  const getTypeIcon = () => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-8 w-8" />;
      case "video":
        return <Video className="h-8 w-8" />;
      case "audio":
        return <Music className="h-8 w-8" />;
      case "pdf":
        return <FileType className="h-8 w-8" />;
      default:
        return <UploadCloud className="h-8 w-8" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case "image":
        return "from-pink-500 to-rose-500";
      case "video":
        return "from-purple-500 to-indigo-500";
      case "audio":
        return "from-blue-500 to-cyan-500";
      case "pdf":
        return "from-red-500 to-orange-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-10 transition-all duration-300 cursor-pointer
          ${
            isDragActive
              ? "border-[#1E40AF] bg-blue-50 scale-[1.02] shadow-lg"
              : "border-gray-300 hover:border-[#1E40AF] hover:bg-gray-50 hover:shadow-md"
          }
          ${value.length >= maxFiles ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center text-center gap-4">
          {/* Icon */}
          <div
            className={`p-4 rounded-full bg-linear-to-br ${getTypeColor()} text-white shadow-lg ${
              isDragActive ? "animate-bounce" : ""
            }`}
          >
            {getTypeIcon()}
          </div>

          {/* Text */}
          <div>
            {isDragActive ? (
              <p className="text-lg font-semibold text-[#1E40AF] mb-2">
                Drop your files here
              </p>
            ) : (
              <>
                <p className="text-base font-medium text-gray-900 mb-2">
                  <span className="text-[#1E40AF] font-semibold cursor-pointer hover:underline">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  {type === "image" && "PNG, JPG, GIF up to 10MB"}
                  {type === "video" && "MP4, MOV, AVI up to 10MB"}
                  {type === "audio" && "MP3, WAV, M4A up to 10MB"}
                  {type === "pdf" && "PDF up to 10MB"}
                </p>
              </>
            )}
          </div>

          {/* File Limit Badge */}
          <div className="mt-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {value.length} / {maxFiles} files uploaded
            </span>
          </div>
        </div>

        {/* Decorative elements */}
        {isDragActive && (
          <div className="absolute inset-0 rounded-2xl bg-blue-500/5 pointer-events-none"></div>
        )}
      </div>

      {/* Upload Queue */}
      {queuedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-[#1E40AF]" />
            Uploading {queuedFiles.length}{" "}
            {queuedFiles.length === 1 ? "file" : "files"}...
          </h4>
          {queuedFiles.map((qFile) => (
            <div
              key={qFile.id}
              className="flex items-center gap-4 p-4 border-2 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Preview/Icon */}
              <div className="h-14 w-14 rounded-lg overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center shrink-0 shadow-inner">
                {qFile.preview ? (
                  <img
                    src={qFile.preview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className={`p-2 rounded-lg bg-linear-to-br ${getTypeColor()} text-white`}
                  >
                    {type === "audio" && <Music className="h-6 w-6" />}
                    {type === "pdf" && <FileText className="h-6 w-6" />}
                    {type === "video" && <Video className="h-6 w-6" />}
                  </div>
                )}
              </div>

              {/* Progress Info */}
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {qFile.file.name}
                  </span>
                  <span className="text-sm font-semibold text-[#1E40AF] whitespace-nowrap">
                    {qFile.progress}%
                  </span>
                </div>
                <Progress value={qFile.progress} className="h-2" />
                <div className="text-xs text-gray-500">
                  {(qFile.file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files Grid */}
      {value.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Uploaded Files ({value.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {value.map((item, index) => (
              <div
                key={item.url}
                className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 group hover:scale-[1.02]"
              >
                {/* Remove Button */}
                <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    type="button"
                    onClick={() => onRemove(item.url)}
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-lg shadow-lg hover:scale-110 transition-transform"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* File Number Badge */}
                <div className="absolute left-2 top-2 z-10">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-semibold">
                    {index + 1}
                  </span>
                </div>

                {/* Content */}
                {type === "image" && (
                  <img
                    src={item.url}
                    alt={`Upload ${index + 1}`}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                )}
                {type === "video" && (
                  <div className="relative w-full h-full">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      controls
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent pointer-events-none"></div>
                  </div>
                )}
                {type === "audio" && (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-cyan-50 p-4">
                    <div className="p-4 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 text-white mb-3 shadow-lg">
                      <FileAudio className="h-8 w-8" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center line-clamp-2">
                      Audio File
                    </span>
                  </div>
                )}
                {type === "pdf" && (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-red-50 to-orange-50 p-4">
                    <div className="p-4 rounded-full bg-linear-to-br from-red-500 to-orange-500 text-white mb-3 shadow-lg">
                      <FileText className="h-8 w-8" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center line-clamp-2">
                      PDF Document
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
