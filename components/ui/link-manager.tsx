"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Trash,
  Link as LinkIcon,
  ExternalLink,
  Globe,
  Check,
} from "lucide-react";
import Link from "next/link";

interface LinkManagerProps {
  links: string[];
  onChange: (links: string[]) => void;
  placeholder?: string;
}

export const LinkManager = ({
  links = [],
  onChange,
  placeholder,
}: LinkManagerProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(false);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setIsValidUrl(validateUrl(value));
  };

  const addLink = () => {
    if (!inputValue.trim() || !isValidUrl) return;
    onChange([...links, inputValue]);
    setInputValue("");
    setIsValidUrl(false);
  };

  const removeLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  const getPlatformIcon = (url: string) => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
      return "🎥";
    } else if (lowerUrl.includes("instagram.com")) {
      return "📷";
    } else if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) {
      return "🐦";
    } else if (lowerUrl.includes("linkedin.com")) {
      return "💼";
    } else if (lowerUrl.includes("facebook.com")) {
      return "👥";
    } else if (lowerUrl.includes("tiktok.com")) {
      return "🎵";
    } else if (lowerUrl.includes("vimeo.com")) {
      return "📹";
    }
    return <Globe className="h-4 w-4" />;
  };

  const getDomain = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace("www.", "");
    } catch {
      return "Invalid URL";
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Link Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder || "https://example.com"}
            className={`pl-10 h-11 border-gray-300 transition-all ${
              inputValue && isValidUrl
                ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                : inputValue && !isValidUrl
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "focus:border-[#1E40AF] focus:ring-[#1E40AF]"
            }`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addLink();
              }
            }}
          />
          {inputValue && isValidUrl && (
            <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
          )}
        </div>
        <Button
          type="button"
          onClick={addLink}
          disabled={!isValidUrl}
          className="bg-linear-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#1E40AF]/90 hover:to-[#3B82F6]/90 h-11 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Link
        </Button>
      </div>

      {links.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Added Links ({links.length})
            </span>
          </div>

          <div className="space-y-2">
            {links.map((link, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 p-4 border-2 rounded-xl bg-white hover:bg-gray-50 hover:border-[#1E40AF]/30 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="shrink-0 h-10 w-10 rounded-lg bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-lg">
                  {getPlatformIcon(link)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      {getDomain(link)}
                    </span>
                  </div>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-900 hover:text-[#1E40AF] truncate block group-hover:underline transition-colors"
                  >
                    {link}
                  </a>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-blue-600" />
                  </Link>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    onClick={() => removeLink(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {links.length === 0 && (
        <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-gray-100 to-gray-200 mb-3">
            <LinkIcon className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            No links added yet
          </p>
          <p className="text-xs text-gray-500">
            Add links to your portfolio, social media, or other online presence
          </p>
        </div>
      )}
    </div>
  );
};
