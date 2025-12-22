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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      getActivityLogs(userId)
        .then((data) => {
          if (data.success) {
            setLogs(data.success);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, userId]);

  const getIcon = (action: string) => {
    if (action.includes("VERIFIED"))
      return <ShieldCheck className="h-5 w-5 text-blue-600" />;
    if (action.includes("UNVERIFIED"))
      return <ShieldAlert className="h-5 w-5 text-amber-600" />;
    if (action.includes("SUSPENDED"))
      return <Ban className="h-5 w-5 text-red-600" />;
    if (action.includes("ACTIVATED"))
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const getIconBackground = (action: string) => {
    if (action.includes("VERIFIED")) return "bg-blue-50";
    if (action.includes("UNVERIFIED")) return "bg-amber-50";
    if (action.includes("SUSPENDED")) return "bg-red-50";
    if (action.includes("ACTIVATED")) return "bg-green-50";
    return "bg-gray-50";
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, " ").toLowerCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Activity Logs: {userName}
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            View all actions performed on this user
          </p>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4 mt-4">
          {loading ? (
            <div className="flex h-full items-center justify-center pt-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center pt-20 pb-10">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium mb-1">
                No activity recorded
              </p>
              <p className="text-sm text-gray-500">
                No actions have been performed on this user yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex gap-4 pb-4 border-b border-gray-100 last:border-0"
                >
                  <div
                    className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${getIconBackground(
                      log.action
                    )}`}
                  >
                    {getIcon(log.action)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900 capitalize">
                        {formatAction(log.action)}
                      </p>
                      <span className="text-xs text-gray-500">
                        {format(new Date(log.createdAt), "MMM d, h:mm a")}
                      </span>
                    </div>

                    {log.details && (
                      <p className="text-sm text-gray-600 mb-3">
                        {log.details}
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                        Performed by:
                      </span>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={log.actor.image || ""} />
                          <AvatarFallback className="text-[10px] bg-blue-100 text-blue-600">
                            {log.actor.name?.charAt(0)?.toUpperCase() || "A"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-700 font-medium">
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
