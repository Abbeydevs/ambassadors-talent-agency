"use client";

import { useState, useTransition } from "react";
import {
  Application,
  ApplicationStatus,
  TalentProfile,
  User,
} from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileText, MessageSquare, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  updateApplicationStatus,
  saveApplicationNote,
} from "@/actions/employer/application-actions";

type FullApplication = Application & {
  talent: TalentProfile & {
    user: User;
  };
};

interface ApplicantCardProps {
  application: FullApplication;
}

export const ApplicantCard = ({ application }: ApplicantCardProps) => {
  const [status, setStatus] = useState(application.status);
  const [note, setNote] = useState(application.notes || "");
  const [isPending, startTransition] = useTransition();
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  const getStatusColor = (s: ApplicationStatus) => {
    switch (s) {
      case "SHORTLISTED":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "HIRED":
        return "bg-green-100 text-green-700 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const onStatusChange = (newStatus: ApplicationStatus) => {
    setStatus(newStatus);

    startTransition(() => {
      updateApplicationStatus(
        application.id,
        newStatus,
        application.jobId
      ).then((data) => {
        if (data.error) {
          toast.error(data.error);
          setStatus(application.status);
        } else {
          toast.success(data.success);
        }
      });
    });
  };

  const onSaveNote = () => {
    startTransition(() => {
      saveApplicationNote(application.id, note, application.jobId).then(
        (data) => {
          if (data.error) toast.error(data.error);
          else {
            toast.success("Note saved");
            setIsNoteOpen(false);
          }
        }
      );
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex gap-4">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={application.talent.user.image || ""} />
            <AvatarFallback>{application.talent.user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-lg leading-none">
              {application.talent.user.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Link
                href={`/profile/${application.talent.userId}`}
                target="_blank"
                className="text-xs text-blue-600 hover:underline flex items-center"
              >
                View Profile <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
              <span className="text-xs text-muted-foreground">
                • Applied {format(new Date(application.createdAt), "MMM d")}
              </span>
            </div>
          </div>
        </div>

        <div className="w-[140px]">
          <Select
            value={status}
            onValueChange={(val) => onStatusChange(val as ApplicationStatus)}
            disabled={isPending}
          >
            <SelectTrigger
              className={`h-8 text-xs font-medium border ${getStatusColor(
                status
              )}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SUBMITTED">Submitted</SelectItem>
              <SelectItem value="REVIEWING">Reviewing</SelectItem>
              <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
              <SelectItem value="INTERVIEW">Interview</SelectItem>
              <SelectItem value="HIRED">Hired</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {application.coverLetter && (
          <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 line-clamp-3 italic relative group">
            &quot;{application.coverLetter}&quot;
          </div>
        )}

        {application.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {application.attachments.map((url, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                asChild
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-3 w-3 mr-1" /> Resume/Doc {i + 1}
                </a>
              </Button>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-slate-50/50 flex justify-between py-2 px-4 border-t">
        <Dialog open={isNoteOpen} onOpenChange={setIsNoteOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              {application.notes ? "Edit Note" : "Add Note"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Internal Note</DialogTitle>
            </DialogHeader>
            <Textarea
              placeholder="Write a private note about this candidate..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-32"
            />
            <DialogFooter>
              <Button onClick={onSaveNote} disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <span className="text-xs text-slate-400">
          {application.talent.user.email}
        </span>
      </CardFooter>
    </Card>
  );
};
