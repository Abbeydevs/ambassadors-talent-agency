/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { TalentProfile, User, PortfolioPhoto } from "@prisma/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, User as UserIcon, ArrowRight } from "lucide-react";

type TalentCardProps = {
  talent: TalentProfile & {
    user: User;
    photos: PortfolioPhoto[];
  };
};

export const PublicTalentCard = ({ talent }: TalentCardProps) => {
  const age = talent.dateOfBirth
    ? new Date().getFullYear() - new Date(talent.dateOfBirth).getFullYear()
    : null;

  return (
    <Link href={`/profile/${talent.userId}`}>
      <Card className="h-full hover:shadow-xl transition-all duration-300 group overflow-hidden border-slate-200 hover:border-[#1E40AF]/50">
        <div className="aspect-4/5 relative bg-slate-100 overflow-hidden">
          {talent.photos.length > 0 ? (
            <img
              src={talent.photos[0].url}
              alt={talent.stageName || talent.user.name || "Talent"}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          ) : talent.user.image ? (
            <img
              src={talent.user.image}
              alt={talent.user.name || "Talent"}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
              <UserIcon className="w-20 h-20" />
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          <div className="absolute bottom-0 left-0 p-4 text-white w-full">
            <h3 className="font-bold text-lg truncate">
              {talent.stageName || talent.user.name}
            </h3>
            <p className="text-sm text-slate-300 truncate">
              {talent.headline || "Creative Talent"}
            </p>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap gap-1.5 h-12 overflow-hidden">
            {talent.talentCategories.length > 0 ? (
              talent.talentCategories.slice(0, 3).map((cat) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className="text-xs bg-slate-100 text-slate-600"
                >
                  {cat}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">
                No categories listed
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            {talent.city && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate max-w-20">{talent.city}</span>
              </div>
            )}
            {age && (
              <div className="flex items-center gap-1">
                <UserIcon className="w-3.5 h-3.5" />
                <span>{age} y/o</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button className="w-full bg-slate-900 hover:bg-[#1E40AF] group-hover:shadow-md transition-all">
            View Profile{" "}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
