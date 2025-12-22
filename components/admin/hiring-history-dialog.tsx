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
import { format } from "date-fns";
import { Loader2, Briefcase, Calendar, UserCheck } from "lucide-react";
import { getEmployerHiringHistory } from "@/actions/admin/get-hiring-history";

// Types matching the Server Action response
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
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-slate-500" />
            Hiring History: {companyName}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <div className="flex h-full items-center justify-center pt-20">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center text-slate-500 pt-20">
              No jobs posted by this company yet.
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              {jobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 bg-slate-50">
                  {/* Job Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {job.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <Calendar className="h-3 w-3" />
                        Posted {format(new Date(job.createdAt), "MMM d, yyyy")}
                      </div>
                    </div>
                    <Badge
                      variant={
                        job.status === "PUBLISHED" ? "default" : "secondary"
                      }
                    >
                      {job.status}
                    </Badge>
                  </div>

                  <div className="bg-white rounded border p-3">
                    <h5 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1">
                      <UserCheck className="h-3 w-3" />
                      Hired Talent ({job.applications.length})
                    </h5>

                    {job.applications.length === 0 ? (
                      <p className="text-sm text-slate-400 italic">
                        No hires recorded yet.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {job.applications.map((app, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded transition-colors"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={app.talent.user.image || ""} />
                              <AvatarFallback>T</AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <p className="font-medium text-slate-900">
                                {app.talent.user.name || "Unknown Talent"}
                              </p>
                              <p className="text-xs text-slate-500">
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
