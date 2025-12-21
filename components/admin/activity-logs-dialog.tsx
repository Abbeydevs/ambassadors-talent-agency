"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { getActivityLogs } from "@/actions/admin/get-activity-logs";
import {
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Ban,
  CheckCircle,
  FileText,
} from "lucide-react";

interface LogEntry {
  id: string;
  action: string;
  details: string | null;
  createdAt: Date;
  actor: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface ActivityLogsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

export const ActivityLogsDialog = ({
  isOpen,
  onClose,
  userId,
  userName,
}: ActivityLogsDialogProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // 👇 FIX: Initialize loading to true directly.
  // Since the component unmounts when closed, this resets automatically.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      // 👇 REMOVED: setLoading(true) to avoid the linter error

      getActivityLogs(userId)
        .then((data) => {
          if (data.success) {
            setLogs(data.success);
          }
        })
        .finally(() => {
          setLoading(false); // Only update state when finished
        });
    }
  }, [isOpen, userId]);

  // Helper to get icon based on action type
  const getIcon = (action: string) => {
    if (action.includes("VERIFIED"))
      return <ShieldCheck className="h-4 w-4 text-blue-500" />;
    if (action.includes("UNVERIFIED"))
      return <ShieldAlert className="h-4 w-4 text-amber-500" />;
    if (action.includes("SUSPENDED"))
      return <Ban className="h-4 w-4 text-red-500" />;
    if (action.includes("ACTIVATED"))
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <FileText className="h-4 w-4 text-slate-500" />;
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, " ").toLowerCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Activity Logs: {userName}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <div className="flex h-full items-center justify-center pt-20">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center text-slate-500 pt-20">
              No activity recorded for this user yet.
            </div>
          ) : (
            <div className="space-y-6 mt-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex gap-4 relative pb-6 border-l border-slate-200 pl-6 last:border-0 last:pb-0"
                >
                  <div className="absolute -left-[29px] top-0 bg-white p-1 rounded-full border border-slate-200">
                    {getIcon(log.action)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-900 capitalize">
                        {formatAction(log.action)}
                      </p>
                      <span className="text-xs text-slate-400">
                        {format(new Date(log.createdAt), "MMM d, h:mm a")}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500">{log.details}</p>

                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        Performed by:
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={log.actor.image || ""} />
                          <AvatarFallback className="text-[8px]">
                            AD
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-slate-600">
                          {log.actor.name || "Admin"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
