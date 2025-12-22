import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAnnouncementHistory } from "@/actions/admin/announcements";
import { AnnouncementForm } from "@/components/admin/communications/announcement-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { History, CheckCircle, Mail, MessageSquare, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function CommunicationsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return redirect("/");

  const historyData = await getAnnouncementHistory();
  const history = historyData.success || [];

  const getAudienceBadge = (audience: string) => {
    switch (audience) {
      case "ALL":
        return (
          <Badge className="bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE] border-0 font-medium text-xs">
            All Users
          </Badge>
        );
      case "TALENT":
        return (
          <Badge className="bg-[#D1FAE5] text-[#065F46] hover:bg-[#D1FAE5] border-0 font-medium text-xs">
            Talents
          </Badge>
        );
      case "EMPLOYER":
        return (
          <Badge className="bg-[#E9D5FF] text-[#6B21A8] hover:bg-[#E9D5FF] border-0 font-medium text-xs">
            Employers
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs font-medium">
            {audience}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-white border-b border-[#E5E7EB] -mx-6 -mt-6 px-6 py-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#EFF6FF] rounded-xl">
            <MessageSquare className="h-6 w-6 text-[#1E40AF]" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
              Communication Center
            </h1>
            <p className="text-[#6B7280] text-sm mt-1">
              Send announcements, system updates, and newsletters to your users
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AnnouncementForm />
        </div>

        <div className="lg:col-span-2">
          <Card className="border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FEF3C7] rounded-lg">
                    <History className="h-5 w-5 text-[#F59E0B]" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-[#111827]">
                      Broadcast History
                    </CardTitle>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Recent announcements sent to users
                    </p>
                  </div>
                </div>
                {history.length > 0 && (
                  <Badge className="bg-[#F9FAFB] text-[#6B7280] border border-[#E5E7EB] font-medium">
                    {history.length}{" "}
                    {history.length === 1 ? "Message" : "Messages"}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="p-4 bg-[#F9FAFB] rounded-full mb-4">
                    <History className="h-8 w-8 text-[#9CA3AF]" />
                  </div>
                  <p className="text-sm text-[#6B7280] font-medium">
                    No announcements sent yet
                  </p>
                  <p className="text-xs text-[#9CA3AF] mt-1">
                    Your broadcast history will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col p-4 border border-[#E5E7EB] rounded-xl hover:border-[#1E40AF] hover:bg-[#F9FAFB] transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className="font-semibold text-sm text-[#111827]">
                              {item.title}
                            </span>
                            {getAudienceBadge(item.audience)}
                            {item.sendAsEmail && (
                              <Badge className="bg-[#EFF6FF] text-[#1E40AF] border border-[#DBEAFE] hover:bg-[#EFF6FF] text-xs font-medium">
                                <Mail className="h-3 w-3 mr-1" />
                                Email Sent
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-[#6B7280] line-clamp-2">
                            {item.message}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#E5E7EB]">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#10B981]">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Delivered</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {formatDistanceToNow(new Date(item.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
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
