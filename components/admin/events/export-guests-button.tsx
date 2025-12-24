"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format } from "date-fns";

interface Guest {
  user: {
    name: string | null;
    email: string | null;
  };
  createdAt: Date;
}

interface ExportGuestsButtonProps {
  data: Guest[];
  eventName: string;
}

export const ExportGuestsButton = ({
  data,
  eventName,
}: ExportGuestsButtonProps) => {
  const handleDownload = () => {
    const headers = ["Name", "Email", "Registration Date"];

    const rows = data.map((rsvp) => [
      rsvp.user.name || "Unknown",
      rsvp.user.email || "No Email",
      format(new Date(rsvp.createdAt), "yyyy-MM-dd HH:mm:ss"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${eventName.replace(/\s+/g, "_")}_GuestList.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant="outline"
      onClick={handleDownload}
      disabled={data.length === 0}
    >
      <Download className="w-4 h-4 mr-2" />
      Export CSV
    </Button>
  );
};
