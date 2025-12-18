"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TalentProfile, User } from "@prisma/client";
import { cn } from "@/lib/utils";

type TalentWithUser = TalentProfile & {
  user: User;
};

interface SavedTalentCardProps {
  talent: TalentWithUser;
  small?: boolean;
}

export const SavedTalentCard = ({
  talent,
  small = false,
}: SavedTalentCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all bg-white">
      <CardContent className={cn("p-4", small && "py-3")}>
        <div className="flex items-start gap-3">
          <Avatar className={cn("border", small ? "h-10 w-10" : "h-12 w-12")}>
            <AvatarImage src={talent.user.image || ""} />
            <AvatarFallback className="bg-slate-100 text-slate-600">
              {talent.user.name?.[0]?.toUpperCase() || "T"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold truncate text-slate-900">
              {talent.user.name}
            </h4>
            <p className="text-xs text-[#1E40AF] font-medium truncate">
              {talent.headline || "Talent"}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {talent.city || "Remote"}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50"
            asChild
          >
            <Link href={`/profile/${talent.userId}`}>View Profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
