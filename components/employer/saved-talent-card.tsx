"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TalentProfile, User } from "@prisma/client";
import { cn } from "@/lib/utils";
import { MapPin, Briefcase, ExternalLink } from "lucide-react";

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
    <Card className="group overflow-hidden hover:shadow-lg hover:border-[#1E40AF] transition-all bg-white border-[#E5E7EB]">
      <CardContent className={cn("p-5", small && "p-4")}>
        {/* Avatar and Info Section */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar
            className={cn(
              "border-2 border-[#E5E7EB] group-hover:border-[#1E40AF] transition-colors",
              small ? "h-12 w-12" : "h-14 w-14"
            )}
          >
            <AvatarImage src={talent.user.image || ""} />
            <AvatarFallback className="bg-[#1E40AF]/10 text-[#1E40AF] font-bold text-lg">
              {talent.user.name?.[0]?.toUpperCase() || "T"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h4
              className={cn(
                "font-bold truncate text-[#111827] group-hover:text-[#1E40AF] transition-colors",
                small ? "text-base" : "text-lg"
              )}
            >
              {talent.user.name}
            </h4>

            {talent.headline && (
              <div className="flex items-center gap-1.5 mt-1">
                <Briefcase className="h-3.5 w-3.5 text-[#6B7280] shrink-0" />
                <p
                  className={cn(
                    "text-[#6B7280] font-medium truncate",
                    small ? "text-xs" : "text-sm"
                  )}
                >
                  {talent.headline}
                </p>
              </div>
            )}

            {talent.city && (
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="h-3.5 w-3.5 text-[#6B7280] shrink-0" />
                <p
                  className={cn(
                    "text-[#6B7280] truncate",
                    small ? "text-xs" : "text-sm"
                  )}
                >
                  {talent.city}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="outline"
          size={small ? "sm" : "default"}
          className="w-full border-[#1E40AF] text-[#1E40AF] hover:bg-[#1E40AF] hover:text-white transition-all font-semibold group-hover:shadow-md"
          asChild
        >
          <Link
            href={`/profile/${talent.userId}`}
            className="flex items-center justify-center gap-2"
          >
            View Profile
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
