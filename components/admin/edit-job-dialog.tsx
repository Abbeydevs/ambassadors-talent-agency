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
import { Loader2, Briefcase } from "lucide-react";

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

  const handleSubmit = () => {
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
      <DialogContent className="sm:max-w-[650px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p>Edit Job Content</p>
              <p className="text-sm font-normal text-gray-500 mt-0.5">
                Update job posting details
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-900"
            >
              Job Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
              className="bg-white border-gray-200 focus-visible:ring-blue-600"
              placeholder="e.g. Senior Software Engineer"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="location"
              className="text-sm font-medium text-gray-900"
            >
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isPending}
              className="bg-white border-gray-200 focus-visible:ring-blue-600"
              placeholder="e.g. Lagos, Nigeria"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="min"
                className="text-sm font-medium text-gray-900"
              >
                Min Salary (₦)
              </Label>
              <Input
                id="min"
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                disabled={isPending}
                placeholder="Optional"
                className="bg-white border-gray-200 focus-visible:ring-blue-600"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="max"
                className="text-sm font-medium text-gray-900"
              >
                Max Salary (₦)
              </Label>
              <Input
                id="max"
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                disabled={isPending}
                placeholder="Optional"
                className="bg-white border-gray-200 focus-visible:ring-blue-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-900"
            >
              Job Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              className="min-h-[180px] bg-white border-gray-200 focus-visible:ring-blue-600"
              placeholder="Describe the role, responsibilities, and requirements..."
            />
          </div>

          <DialogFooter className="mt-6 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="border-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
