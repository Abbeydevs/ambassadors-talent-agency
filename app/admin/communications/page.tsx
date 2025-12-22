import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAnnouncementHistory } from "@/actions/admin/announcements";
import { AnnouncementForm } from "@/components/admin/communications/announcement-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { History, CheckCircle, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function CommunicationsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return redirect("/");

  const historyData = await getAnnouncementHistory();
  const history = historyData.success || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Communication Center
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Send announcements, system updates, and newsletters to your users.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AnnouncementForm />
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-slate-500" />
                <CardTitle>Broadcast History</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  No announcements sent yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">
                            {item.title}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {item.audience}
                          </Badge>
                          {item.sendAsEmail && (
                            <Badge
                              variant="outline"
                              className="text-xs border-blue-200 text-blue-700 bg-blue-50"
                            >
                              <Mail className="h-3 w-3 mr-1" /> Email
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-1">
                          {item.message}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 mt-2 sm:mt-0 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          Sent
                        </div>
                        <span>
                          {formatDistanceToNow(new Date(item.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
