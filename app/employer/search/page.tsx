import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { searchTalents } from "@/data/talent-search";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    location?: string;
  }>;
}

export default async function TalentSearchPage({
  searchParams,
}: SearchPageProps) {
  const session = await auth();
  if (session?.user?.role !== "EMPLOYER") return redirect("/");

  const params = await searchParams;
  const query = params.q || "";

  const talents = await searchTalents({
    searchTerm: query,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Find Talent</h2>
        <p className="text-muted-foreground">
          Search for the perfect candidate for your next project.
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <form className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              name="q"
              defaultValue={query}
              placeholder="Search by name, role, or keyword..."
              className="pl-10"
            />
          </div>
          <Button type="submit" className="bg-[#1E40AF]">
            Search
          </Button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {talents.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg border border-dashed">
            <p className="text-muted-foreground">
              No talents found matching &quot;{query}&quot;
            </p>
          </div>
        ) : (
          talents.map((talent) => (
            <Card
              key={talent.id}
              className="overflow-hidden hover:shadow-md transition-all"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-14 w-14 border">
                  <AvatarImage src={talent.user.image || ""} />
                  <AvatarFallback className="bg-slate-100 text-slate-600">
                    {talent.user.name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg leading-tight">
                    {talent.user.name}
                  </h3>
                  <p className="text-sm text-[#1E40AF] font-medium truncate max-w-[200px]">
                    {talent.headline || "Talent"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {talent.city}
                    {talent.city && talent.country ? ", " : ""}
                    {talent.country}
                    {!talent.city && !talent.country && "Remote"}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1.5 h-16 overflow-hidden content-start">
                  {talent.skills.slice(0, 5).map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="text-xs font-normal bg-slate-100 hover:bg-slate-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {talent.skills.length > 5 && (
                    <span className="text-xs text-slate-400 self-center">
                      +{talent.skills.length - 5} more
                    </span>
                  )}
                </div>

                <div className="pt-2 flex gap-2">
                  <Button
                    className="w-full bg-slate-900 text-white"
                    size="sm"
                    asChild
                  >
                    <Link href={`/profile/${talent.userId}`}>View Profile</Link>
                  </Button>
                  {/* Future: Add 'Save' or 'Invite' button here */}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
