import { BadgeCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const VerificationBadge = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center justify-center">
            <BadgeCheck className="h-5 w-5 text-blue-600 fill-blue-50" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Verified Company</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
