import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import {
  ShieldCheck,
  ShieldAlert,
  Ban,
  CheckCircle,
  FileText,
} from "lucide-react";

interface ActivityLog {
  id: string;
  action: string;
  details: string | null;
  createdAt: Date;
  actor: { name: string | null; image: string | null };
  targetUser: {
    name: string | null;
    email: string | null;
    companyName: string | null;
  } | null;
}

interface RecentActivityListProps {
  logs: ActivityLog[];
}

export const RecentActivityList = ({ logs }: RecentActivityListProps) => {
  // Icon Helper
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
    <Card className="col-span-1">
      {" "}
      {/* This ensures it fits in a grid layout */}
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          ) : (
            logs.map((log) => {
              const targetName =
                log.targetUser?.companyName ||
                log.targetUser?.name ||
                "Unknown User";

              return (
                <div key={log.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none flex items-center gap-2">
                      {getIcon(log.action)}
                      <span className="capitalize">
                        {formatAction(log.action)}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-slate-700">
                        {log.actor.name}
                      </span>{" "}
                      performed action on{" "}
                      <span className="font-semibold text-slate-700">
                        {targetName}
                      </span>
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-xs text-slate-500">
                    {formatDistanceToNow(log.createdAt, { addSuffix: true })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
