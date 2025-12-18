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
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";
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
      case "SHORTLISTED":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      case "HIRED":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "REJECTED":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      default:
        return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    }
  };

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white p-2 px-4 rounded-lg flex items-center justify-between shadow-lg animate-in slide-in-from-top-2">
          <span className="text-sm font-medium">
            {selectedIds.length} candidates selected
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="destructive"
              disabled={isPending}
              onClick={() => onBulkAction("REJECTED")}
              className="h-8 text-xs"
            >
              Reject Selected
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
              disabled={isPending}
              onClick={() => onBulkAction("SHORTLISTED")}
            >
              Shortlist Selected
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedIds.length === applications.length &&
                    applications.length > 0
                  }
                  onCheckedChange={(checked) => toggleAll(!!checked)}
                />
              </TableHead>
              <TableHead>Candidate</TableHead>
              <TableHead>Applied For</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  No applications found.
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow
                  key={app.id}
                  data-state={selectedIds.includes(app.id) && "selected"}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(app.id)}
                      onCheckedChange={(checked) =>
                        toggleOne(app.id, !!checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={app.talent.user.image || ""} />
                        <AvatarFallback>
                          {app.talent.user.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {app.talent.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {app.talent.user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-[#1E40AF]">
                    {app.job.title}
                  </TableCell>
                  <TableCell>
                    {format(new Date(app.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {isPending && selectedIds.includes(app.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                    ) : (
                      <Badge
                        className={`rounded-md font-normal shadow-none ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/employer/jobs/${app.jobId}/applications`}>
                        <Eye className="h-4 w-4 mr-2" /> View
                      </Link>
                    </Button>
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
