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

const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};

export const RecentActivityList = ({ logs }: RecentActivityListProps) => {
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
    <div className="bg-white border border-gray-200 rounded-xl p-6 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <p className="text-sm text-gray-500 mt-1">
          Latest admin actions and updates
        </p>
      </div>

      <div className="space-y-4 max-h-[680px] overflow-y-auto pr-2">
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No recent activity.</p>
          </div>
        ) : (
          logs.map((log) => {
            const targetName =
              log.targetUser?.companyName ||
              log.targetUser?.name ||
              "Unknown User";

            return (
              <div
                key={log.id}
                className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${getIconBackground(
                    log.action
                  )}`}
                >
                  {getIcon(log.action)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 capitalize mb-1">
                    {formatAction(log.action)}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <span className="font-semibold text-gray-900">
                      {log.actor.name}
                    </span>{" "}
                    performed action on{" "}
                    <span className="font-semibold text-gray-900">
                      {targetName}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1.5">
                    {formatTimeAgo(log.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
