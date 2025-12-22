"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { adminUpdateUser } from "@/actions/admin/update-user";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    companyName?: string | null;
    role: string;
  };
}

export const EditUserDialog = ({
  isOpen,
  onClose,
  user,
}: EditUserDialogProps) => {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [companyName, setCompanyName] = useState(user.companyName || "");

  const handleSubmit = () => {
    startTransition(() => {
      adminUpdateUser({
        userId: user.id,
        name,
        email,
        companyName: user.role === "EMPLOYER" ? companyName : undefined,
        role: user.role,
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
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Edit User Information
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Update user details below
          </p>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-900">
              Full Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              className="bg-white border-gray-200 focus-visible:ring-blue-600"
              placeholder="Enter full name"
            />
          </div>

          {user.role === "EMPLOYER" && (
            <div className="space-y-2">
              <Label
                htmlFor="companyName"
                className="text-sm font-medium text-gray-900"
              >
                Company Name
              </Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={isPending}
                className="bg-white border-gray-200 focus-visible:ring-blue-600"
                placeholder="Enter company name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-900"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              className="bg-white border-gray-200 focus-visible:ring-blue-600"
              placeholder="Enter email address"
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
