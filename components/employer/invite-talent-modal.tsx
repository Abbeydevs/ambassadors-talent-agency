"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { inviteTalentToJob } from "@/actions/employer/invite-talent";

interface JobOption {
  id: string;
  title: string;
}

interface InviteTalentModalProps {
  talentId: string;
  talentName: string;
  jobs: JobOption[]; // We will pass the list of open jobs here
}

export const InviteTalentModal = ({
  talentId,
  talentName,
  jobs,
}: InviteTalentModalProps) => {
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const onSend = () => {
    if (!selectedJob) {
      toast.error("Please select a job");
      return;
    }

    startTransition(() => {
      inviteTalentToJob(talentId, selectedJob, message).then((data) => {
        if (data.error) toast.error(data.error);
        else {
          toast.success("Invitation sent!");
          setOpen(false);
          setMessage("");
          setSelectedJob("");
        }
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
        >
          <Mail className="w-4 h-4 mr-2" /> Invite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite {talentName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Select Job</Label>
            <Select onValueChange={setSelectedJob} value={selectedJob}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an open job..." />
              </SelectTrigger>
              <SelectContent>
                {jobs.length === 0 ? (
                  <div className="p-2 text-sm text-slate-500 text-center">
                    No open jobs found.
                  </div>
                ) : (
                  jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Message (Optional)</Label>
            <Textarea
              placeholder={`Hi ${talentName}, I think you'd be a great fit...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={onSend}
            disabled={isPending || jobs.length === 0}
            className="bg-[#1E40AF]"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Send Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
