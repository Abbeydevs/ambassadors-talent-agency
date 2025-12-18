"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toggleSaveTalent } from "@/actions/employer/save-talent";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SaveTalentButtonProps {
  talentId: string;
  initialIsSaved: boolean;
}

export const SaveTalentButton = ({
  talentId,
  initialIsSaved,
}: SaveTalentButtonProps) => {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    setIsSaved((prev) => !prev);

    startTransition(() => {
      toggleSaveTalent(talentId)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
            setIsSaved((prev) => !prev);
          } else {
            toast.success(data.success);
          }
        })
        .catch(() => setIsSaved((prev) => !prev));
    });
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={onClick}
      disabled={isPending}
      className="h-9 w-9 rounded-full bg-white hover:bg-slate-50 border shadow-sm"
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-colors",
          isSaved ? "fill-red-500 text-red-500" : "text-slate-400"
        )}
      />
    </Button>
  );
};
