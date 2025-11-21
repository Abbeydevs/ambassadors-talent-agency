"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Link as LinkIcon } from "lucide-react";

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

  const addLink = () => {
    if (!inputValue.trim()) return;
    onChange([...links, inputValue]);
    setInputValue("");
  };

  const removeLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {links.map((link, index) => (
        <div
          key={index}
          className="flex items-center gap-2 p-2 border rounded-md bg-slate-50"
        >
          <LinkIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm flex-1 truncate">{link}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => removeLink(index)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder || "https://..."}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addLink();
            }
          }}
        />
        <Button type="button" onClick={addLink} variant="secondary">
          <Plus className="h-4 w-4 mr-2" /> Add
        </Button>
      </div>
    </div>
  );
};
