import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminReports } from "@/actions/admin/reports";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, User, Briefcase, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ModerationPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return redirect("/");

  const result = await getAdminReports();
  const reports = result.success || [];

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Moderation Queue
        </h1>
        <p className="text-slate-500 mt-2">
          Review flagged content and take action on reports.
        </p>
      </div>

      <div className="grid gap-6">
        {reports.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-slate-500">
              <ShieldAlert className="h-12 w-12 mb-4 text-slate-300" />
              <p>All clear! No pending reports.</p>
            </CardContent>
          </Card>
        ) : (
          reports.map((report) => (
            <Card
              key={report.id}
              className="overflow-hidden border-l-4 border-l-red-500"
            >
              <CardHeader className="bg-slate-50/50 pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="uppercase">
                      {report.reason.replace("_", " ")}
                    </Badge>
                    <span className="text-sm text-slate-500">
                      Reported by {report.reporter.name}
                    </span>
                  </div>
                  <Badge variant="outline">{report.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900">
                      Complaint Details:
                    </h3>
                    <p className="text-slate-600 bg-slate-50 p-3 rounded-md text-sm min-h-20">
                      {report.details || "No additional details provided."}
                    </p>
                  </div>

                  <div className="space-y-4 border-l pl-0 md:pl-6">
                    <h3 className="font-semibold text-slate-900">
                      Target Content:
                    </h3>

                    {report.targetJobId ? (
                      <div className="flex items-start gap-3">
                        <Briefcase className="h-5 w-5 text-blue-600 mt-1" />
                        <div>
                          <p className="font-medium text-slate-900">
                            Job: {report.targetJob?.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            ID: {report.targetJobId}
                          </p>
                          <Button
                            variant="link"
                            asChild
                            className="p-0 h-auto text-blue-600 mt-1"
                          >
                            <Link
                              href={`/jobs/${report.targetJobId}`}
                              target="_blank"
                            >
                              View Job <ExternalLink className="h-3 w-3 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-purple-600 mt-1" />
                        <div>
                          <p className="font-medium text-slate-900">
                            User: {report.targetUser?.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {report.targetUser?.role} •{" "}
                            {report.targetUser?.email}
                          </p>
                          <Button
                            variant="link"
                            asChild
                            className="p-0 h-auto text-blue-600 mt-1"
                          >
                            <Link
                              href={`/admin/users?search=${report.targetUser?.email}`}
                              target="_blank"
                            >
                              Manage User{" "}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
