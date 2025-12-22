"use client";

import { useTransition } from "react";
import { Ticket, TicketStatus, TicketPriority } from "@prisma/client";
import { updateTicketStatus } from "@/actions/admin/tickets";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TicketWithUser extends Ticket {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
    role: "ADMIN" | "USER" | "TALENT" | "EMPLOYER";
  };
}

interface TicketListProps {
  tickets: TicketWithUser[];
}

export const TicketList = ({ tickets }: TicketListProps) => {
  const [isPending, startTransition] = useTransition();

  const onStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    startTransition(() => {
      updateTicketStatus(ticketId, newStatus)
        .then((data) => {
          if (data.error) toast.error(data.error);
          else toast.success("Ticket status updated");
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 text-red-700 border-red-200";
      case "HIGH":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "MEDIUM":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case "RESOLVED":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "CLOSED":
        return <Circle className="h-4 w-4 text-slate-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Tickets</CardTitle>
        <CardDescription>Manage and respond to user inquiries.</CardDescription>
      </CardHeader>
      <CardContent>
        {tickets.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            No active tickets found.
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg gap-4 bg-white"
              >
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={ticket.user.image || ""} />
                    <AvatarFallback>
                      {ticket.user.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        {ticket.subject}
                      </span>
                      <Badge
                        variant="outline"
                        className={getPriorityColor(ticket.priority)}
                      >
                        {ticket.priority}
                      </Badge>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2 max-w-xl">
                      {ticket.message}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                      <span>
                        {ticket.user.name} ({ticket.user.role})
                      </span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(ticket.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {getStatusIcon(ticket.status)}
                    <span className="capitalize">
                      {ticket.status.replace("_", " ").toLowerCase()}
                    </span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={isPending}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onStatusChange(ticket.id, "IN_PROGRESS")}
                      >
                        Mark In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(ticket.id, "RESOLVED")}
                      >
                        Mark Resolved
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(ticket.id, "CLOSED")}
                      >
                        Close Ticket
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
