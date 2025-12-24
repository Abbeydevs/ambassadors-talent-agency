"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { registerForEvent } from "@/actions/event-rsvp";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";

interface RSVPButtonProps {
  eventId: string;
  isRegistered: boolean;
  isLoggedIn: boolean;
}

export const RSVPButton = ({
  eventId,
  isRegistered,
  isLoggedIn,
}: RSVPButtonProps) => {
  const [pending, startTransition] = useTransition();

  const handleRSVP = () => {
    if (!isLoggedIn) {
      toast.error("Please login to register for events.");
      return;
    }

    startTransition(() => {
      registerForEvent(eventId)
        .then((data) => {
          if (data.error) toast.error(data.error);
          if (data.success) toast.success(data.success);
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  if (isRegistered) {
    return (
      <Button disabled className="w-full bg-green-600 hover:bg-green-700">
        <Check className="w-4 h-4 mr-2" /> You are Registered
      </Button>
    );
  }

  return (
    <Button
      onClick={handleRSVP}
      disabled={pending}
      className="w-full"
      size="lg"
    >
      {pending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      RSVP for Event
    </Button>
  );
};
