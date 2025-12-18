import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getEmployerProfileByUserId } from "@/data/employer-profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, FolderOpen } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SavedTalentCard } from "@/components/employer/saved-talent-card";

export default async function SavedTalentsPage() {
  const session = await auth();
  if (session?.user?.role !== "EMPLOYER" || !session?.user?.id)
    return redirect("/");

  const profile = await getEmployerProfileByUserId(session.user.id);
  if (!profile) return redirect("/employer/onboarding");

  const savedTalents = await db.savedTalent.findMany({
    where: { employerId: profile.id },
    include: {
      talent: {
        include: { user: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const shortlists = await db.shortlist.findMany({
    where: { employerId: profile.id },
    include: {
      items: {
        include: {
          talent: {
            include: { user: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Saved & Shortlists
        </h2>
        <p className="text-muted-foreground">
          Manage your favorite talents and organized lists.
        </p>
      </div>

      <Tabs defaultValue="favorites" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="favorites">
            Favorites ({savedTalents.length})
          </TabsTrigger>
          <TabsTrigger value="shortlists">
            Shortlists ({shortlists.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="favorites" className="mt-6">
          {savedTalents.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg bg-slate-50">
              <Heart className="mx-auto h-10 w-10 text-slate-300 mb-3" />
              <h3 className="text-lg font-medium text-slate-900">
                No favorites yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Start searching and click the heart icon to save talents here.
              </p>
              <Button asChild>
                <Link href="/employer/search">Find Talent</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {savedTalents.map(({ talent }) => (
                <SavedTalentCard key={talent.id} talent={talent} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="shortlists" className="mt-6">
          {shortlists.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg bg-slate-50">
              <FolderOpen className="mx-auto h-10 w-10 text-slate-300 mb-3" />
              <h3 className="text-lg font-medium text-slate-900">
                No shortlists created
              </h3>
              <p className="text-muted-foreground mb-4">
                Organize talents into custom lists for your projects.
              </p>
              <Button asChild>
                <Link href="/employer/search">Find Talent</Link>
              </Button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {shortlists.map((list) => (
                <AccordionItem
                  key={list.id}
                  value={list.id}
                  className="border rounded-lg px-4 bg-white"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <FolderOpen className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-base">{list.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {list.items.length} talents
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    {list.items.length === 0 ? (
                      <p className="text-sm text-slate-500 italic pl-14">
                        This list is empty.
                      </p>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pl-2 md:pl-12 pt-2">
                        {list.items.map(({ talent }) => (
                          <SavedTalentCard
                            key={talent.id}
                            talent={talent}
                            small={true}
                          />
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
