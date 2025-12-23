"use client";

import { Facebook, Linkedin, Link2, Twitter, Check } from "lucide-react";
import { useState } from "react";

interface SocialShareProps {
  title: string;
  url: string;
}

export default function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openShare = (link: string) => {
    window.open(link, "_blank", "width=600,height=400");
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-500 text-sm font-medium mr-2">Share:</span>

      <button
        onClick={() => openShare(shareLinks.twitter)}
        className="p-2 rounded-full bg-slate-100 hover:bg-black hover:text-white text-slate-600 transition-colors"
        title="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
      </button>

      <button
        onClick={() => openShare(shareLinks.linkedin)}
        className="p-2 rounded-full bg-slate-100 hover:bg-[#0077b5] hover:text-white text-slate-600 transition-colors"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </button>

      <button
        onClick={() => openShare(shareLinks.facebook)}
        className="p-2 rounded-full bg-slate-100 hover:bg-[#1877f2] hover:text-white text-slate-600 transition-colors"
        title="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
      </button>

      <button
        onClick={copyToClipboard}
        className="p-2 rounded-full bg-slate-100 hover:bg-amber-500 hover:text-white text-slate-600 transition-colors relative"
        title="Copy Link"
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
      </button>

      {copied && (
        <span className="text-xs text-green-600 font-medium animate-in fade-in">
          Copied!
        </span>
      )}
    </div>
  );
}
