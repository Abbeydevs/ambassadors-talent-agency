"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Briefcase, Calendar, UserCheck } from "lucide-react";
import { getEmployerHiringHistory } from "@/actions/admin/get-hiring-history";

interface HiredTalent {
  talent: {
    user: {
      name: string | null;
      email: string | null;
      image: string | null;
    };
  };
}

interface JobHistory {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
  applications: HiredTalent[];
}

interface HiringHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  companyName: string;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export const HiringHistoryDialog = ({
  isOpen,
  onClose,
  userId,
  companyName,
}: HiringHistoryDialogProps) => {
  const [jobs, setJobs] = useState<JobHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      getEmployerHiringHistory(userId)
        .then((data) => {
          if (data.success) {
            setJobs(data.success);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, userId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p>Hiring History</p>
              <p className="text-sm font-normal text-gray-500 mt-0.5">
                {companyName}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4 mt-4">
          {loading ? (
            <div className="flex h-full items-center justify-center pt-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center pt-20 pb-10">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium mb-1">
                No jobs posted yet
              </p>
              <p className="text-sm text-gray-500">
                This company hasn&apos;t posted any jobs
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="border border-gray-200 rounded-xl p-5 bg-linear-to-br from-gray-50 to-white hover:shadow-md transition-shadow"
                >
                  {/* Job Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg mb-2">
                        {job.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        Posted {formatDate(job.createdAt)}
                      </div>
                    </div>
                    <Badge
                      variant={
                        job.status === "PUBLISHED" ? "default" : "secondary"
                      }
                      className={
                        job.status === "PUBLISHED"
                          ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                      }
                    >
                      {job.status}
                    </Badge>
                  </div>

                  {/* Hired Talents Section */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h5 className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-blue-600" />
                      Hired Talent ({job.applications.length})
                    </h5>

                    {job.applications.length === 0 ? (
                      <p className="text-sm text-gray-400 italic py-2">
                        No hires recorded yet
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {job.applications.map((app, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                          >
                            <Avatar className="h-10 w-10 border-2 border-white ring-2 ring-gray-100">
                              <AvatarImage src={app.talent.user.image || ""} />
                              <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm">
                                {app.talent.user.name
                                  ?.charAt(0)
                                  ?.toUpperCase() || "T"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-gray-900">
                                {app.talent.user.name || "Unknown Talent"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {app.talent.user.email}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
