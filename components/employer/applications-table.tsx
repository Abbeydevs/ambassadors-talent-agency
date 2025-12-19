"use client";

import { useState, useTransition } from "react";
import {
  Application,
  TalentProfile,
  User,
  ApplicationStatus,
} from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ChevronRight, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { bulkUpdateApplicationStatus } from "@/actions/employer/application-actions";

type ApplicationWithRelations = Application & {
  job: { title: string };
  talent: TalentProfile & { user: User };
};

interface ApplicationsTableProps {
  applications: ApplicationWithRelations[];
}

export const ApplicationsTable = ({ applications }: ApplicationsTableProps) => {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(applications.map((app) => app.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const onBulkAction = (status: ApplicationStatus) => {
    if (selectedIds.length === 0) return;

    startTransition(() => {
      bulkUpdateApplicationStatus(selectedIds, status).then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);
          setSelectedIds([]);
        }
      });
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20";
      case "SHORTLISTED":
        return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20";
      case "HIRED":
        return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20";
      case "REJECTED":
        return "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20";
      case "INTERVIEW":
        return "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20";
      default:
        return "bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20";
    }
  };

  const handleRowClick = (
    app: ApplicationWithRelations,
    e: React.MouseEvent
  ) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest('[role="checkbox"]') ||
      target.closest('input[type="checkbox"]')
    ) {
      return;
    }
    router.push(`/employer/jobs/${app.jobId}/applications`);
  };

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="bg-[#1F2937] text-white p-4 px-6 rounded-xl flex items-center justify-between shadow-lg animate-in slide-in-from-top-2">
          <span className="text-sm font-semibold">
            {selectedIds.length} candidate{selectedIds.length > 1 ? "s" : ""}{" "}
            selected
          </span>
          <div className="flex gap-3">
            <Button
              size="sm"
              variant="destructive"
              disabled={isPending}
              onClick={() => onBulkAction("REJECTED")}
              className="h-9 bg-[#EF4444] hover:bg-[#DC2626] font-medium"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Reject Selected
            </Button>
            <Button
              size="sm"
              className="h-9 bg-[#10B981] hover:bg-[#059669] text-white font-medium"
              disabled={isPending}
              onClick={() => onBulkAction("SHORTLISTED")}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Shortlist Selected
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB]">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedIds.length === applications.length &&
                    applications.length > 0
                  }
                  onCheckedChange={(checked) => toggleAll(!!checked)}
                />
              </TableHead>
              <TableHead className="font-semibold text-[#111827]">
                Candidate
              </TableHead>
              <TableHead className="font-semibold text-[#111827]">
                Applied For
              </TableHead>
              <TableHead className="font-semibold text-[#111827]">
                Date Applied
              </TableHead>
              <TableHead className="font-semibold text-[#111827]">
                Status
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-40 text-center text-[#6B7280]"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-[#F9FAFB] rounded-full">
                      <FileText className="h-8 w-8 text-[#9CA3AF]" />
                    </div>
                    <p className="font-medium">No applications found</p>
                    <p className="text-sm">
                      Applications will appear here when candidates apply
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow
                  key={app.id}
                  data-state={selectedIds.includes(app.id) && "selected"}
                  className="cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                  onClick={(e) => handleRowClick(app, e)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.includes(app.id)}
                      onCheckedChange={(checked) =>
                        toggleOne(app.id, !!checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-[#E5E7EB]">
                        <AvatarImage src={app.talent.user.image || ""} />
                        <AvatarFallback className="bg-[#1E40AF]/10 text-[#1E40AF] font-semibold">
                          {app.talent.user.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#111827]">
                          {app.talent.user.name}
                        </span>
                        <span className="text-sm text-[#6B7280]">
                          {app.talent.user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-[#1E40AF]">
                      {app.job.title}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-[#6B7280] font-medium">
                      {format(new Date(app.createdAt), "MMM d, yyyy")}
                    </span>
                  </TableCell>
                  <TableCell>
                    {isPending && selectedIds.includes(app.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin text-[#6B7280]" />
                    ) : (
                      <Badge
                        className={`rounded-full font-semibold border ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="h-5 w-5 text-[#9CA3AF]" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
