"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminUpdateJob } from "@/actions/admin/update-job";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EditJobDialogProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    salaryMin?: number | null;
    salaryMax?: number | null;
  };
}

export const EditJobDialog = ({ isOpen, onClose, job }: EditJobDialogProps) => {
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(job.title);
  const [location, setLocation] = useState(job.location);
  const [salaryMin, setSalaryMin] = useState(job.salaryMin?.toString() || "");
  const [salaryMax, setSalaryMax] = useState(job.salaryMax?.toString() || "");
  const [description, setDescription] = useState(job.description);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(() => {
      adminUpdateJob({
        jobId: job.id,
        title,
        location,
        description,
        salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
        salaryMax: salaryMax ? parseInt(salaryMax) : undefined,
      })
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success(data.success);
            onClose();
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job Content</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min">Min Salary</Label>
              <Input
                id="min"
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                disabled={isPending}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max">Max Salary</Label>
              <Input
                id="max"
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                disabled={isPending}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              className="min-h-[150px]"
            />
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
