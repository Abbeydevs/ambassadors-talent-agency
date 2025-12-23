import { db } from "@/lib/db";
import { Role } from "@prisma/client";
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
import { AddAuthorDialog } from "@/components/admin/authors/add-author-dialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AuthorsPage() {
  const staff = await db.user.findMany({
    where: {
      role: { in: [Role.ADMIN, Role.AUTHOR] },
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { blogPosts: true },
      },
    },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Authors & Staff</h1>
          <p className="text-slate-500">
            Manage the team writing your content.
          </p>
        </div>
        <AddAuthorDialog />
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Articles</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback>
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-slate-500">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === Role.ADMIN ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user._count.blogPosts} posts</TableCell>
                <TableCell className="text-slate-500">Active</TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/authors/${user.id}`}>
                    <Button variant="outline" size="sm">
                      Edit Profile
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
