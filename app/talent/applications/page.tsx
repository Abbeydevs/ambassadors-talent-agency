import { auth } from "@/auth";
import { getAllTalentApplications } from "@/data/talent-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Briefcase, MapPin, Building2, Clock, ArrowRight } from "lucide-react";

export default async function MyApplicationsPage() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/auth/login");

  const applications = await getAllTalentApplications(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            My Applications
          </h1>
          <p className="text-gray-500 mt-1">
            Track the status of all your job applications
          </p>
        </div>
        <Link href="/jobs">
          <Button className="bg-[#1E40AF] hover:bg-[#1E40AF]/90">
            Browse More Jobs
          </Button>
        </Link>
      </div>

      {applications.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-200 bg-gray-50/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-white rounded-full shadow-sm mb-4">
              <Briefcase className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              No applications found
            </h3>
            <p className="text-gray-500 max-w-sm mt-2 mb-6">
              You haven&apos;t applied to any jobs yet. Your application history
              will appear here once you start applying.
            </p>
            <Link href="/jobs">
              <Button variant="outline">Find Jobs to Apply</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card
              key={app.id}
              className="hover:shadow-md transition-shadow border-gray-200"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Job Info */}
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 shrink-0 rounded-lg bg-gray-100 border flex items-center justify-center overflow-hidden">
                      {app.job.employer.companyLogoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={app.job.employer.companyLogoUrl}
                          alt="Logo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Building2 className="h-6 w-6 text-gray-400" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                        {app.job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                        <span className="font-medium text-gray-700">
                          {app.job.employer.companyName}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {app.job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          Applied{" "}
                          {format(new Date(app.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Action */}
                  <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        className={`px-3 py-1 text-xs font-semibold ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status.replace("_", " ")}
                      </Badge>
                      {/* Optional: Add payment status if hired */}
                      {app.status === "HIRED" && (
                        <span className="text-xs text-green-600 font-medium">
                          Offer Accepted
                        </span>
                      )}
                    </div>
                    <Link href={`/jobs/${app.job.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-[#1E40AF]"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "HIRED":
      return "bg-green-100 text-green-700 border-green-200 hover:bg-green-100";
    case "INTERVIEW":
      return "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100";
    case "REJECTED":
      return "bg-red-100 text-red-700 border-red-200 hover:bg-red-100";
    case "SHORTLISTED":
      return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100";
    default:
      return "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100";
  }
}
