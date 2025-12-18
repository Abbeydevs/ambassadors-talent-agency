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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ListPlus, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  createShortlist,
  addToShortlist,
} from "@/actions/employer/shortlist-actions";

interface ShortlistOption {
  id: string;
  name: string;
}

interface AddToShortlistModalProps {
  talentId: string;
  talentName: string;
  existingLists: ShortlistOption[];
}

export const AddToShortlistModal = ({
  talentId,
  talentName,
  existingLists,
}: AddToShortlistModalProps) => {
  const [open, setOpen] = useState(false);
  const [lists, setLists] = useState<ShortlistOption[]>(existingLists);
  const [selectedListId, setSelectedListId] = useState("");
  const [newListName, setNewListName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateAndAdd = () => {
    if (!newListName) return;

    startTransition(() => {
      createShortlist(newListName).then((res) => {
        if (res.error || !res.list) {
          toast.error(res.error);
        } else {
          const newList = res.list;
          setLists([newList, ...lists]);
          addToShortlist(newList.id, talentId).then(() => {
            toast.success(`Created "${newList.name}" and added ${talentName}`);
            setOpen(false);
            setNewListName("");
            setIsCreating(false);
          });
        }
      });
    });
  };

  const handleAddToExisting = () => {
    if (!selectedListId) return;

    startTransition(() => {
      addToShortlist(selectedListId, talentId).then((res) => {
        if (res.error) toast.error(res.error);
        else {
          toast.success("Added to shortlist");
          setOpen(false);
        }
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-slate-500 hover:text-slate-900 border border-slate-200 rounded-full ml-2"
        >
          <ListPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add {talentName} to Shortlist</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!isCreating ? (
            <div className="space-y-3">
              <Label>Select a list</Label>
              <Select onValueChange={setSelectedListId} value={selectedListId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a shortlist..." />
                </SelectTrigger>
                <SelectContent>
                  {lists.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      No lists created yet
                    </div>
                  ) : (
                    lists.map((list) => (
                      <SelectItem key={list.id} value={list.id}>
                        {list.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsCreating(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Create New List
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Label>New List Name</Label>
              <Input
                placeholder="e.g. Summer Campaign 2025"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[#1E40AF]"
                  onClick={handleCreateAndAdd}
                  disabled={!newListName || isPending}
                >
                  {isPending ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    "Create & Add"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {!isCreating && (
          <DialogFooter>
            <Button
              onClick={handleAddToExisting}
              disabled={!selectedListId || isPending}
              className="bg-[#1E40AF]"
            >
              {isPending ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Save to List"
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
