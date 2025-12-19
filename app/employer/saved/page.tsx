import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getEmployerProfileByUserId } from "@/data/employer-profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, FolderOpen, Users, Bookmark } from "lucide-react";
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#8B5CF6]/10 rounded-lg">
            <Bookmark className="h-6 w-6 text-[#8B5CF6]" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#111827]">
              Saved & Shortlists
            </h2>
            <p className="text-[#6B7280] text-base mt-1">
              Manage your favorite talents and organized lists
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1 font-medium">
                  Favorites
                </p>
                <p className="text-3xl font-bold text-[#EF4444]">
                  {savedTalents.length}
                </p>
              </div>
              <div className="p-3 bg-[#EF4444]/10 rounded-lg">
                <Heart className="h-6 w-6 text-[#EF4444]" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1 font-medium">
                  Shortlists
                </p>
                <p className="text-3xl font-bold text-[#8B5CF6]">
                  {shortlists.length}
                </p>
              </div>
              <div className="p-3 bg-[#8B5CF6]/10 rounded-lg">
                <FolderOpen className="h-6 w-6 text-[#8B5CF6]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="favorites" className="w-full">
        <TabsList className="grid w-full max-w-[450px] grid-cols-2 h-12 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-1">
          <TabsTrigger
            value="favorites"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#111827] data-[state=active]:shadow-sm font-semibold"
          >
            <Heart className="h-4 w-4 mr-2" />
            Favorites ({savedTalents.length})
          </TabsTrigger>
          <TabsTrigger
            value="shortlists"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#111827] data-[state=active]:shadow-sm font-semibold"
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Shortlists ({shortlists.length})
          </TabsTrigger>
        </TabsList>

        {/* Favorites Tab */}
        <TabsContent value="favorites" className="mt-6">
          {savedTalents.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-[#E5E7EB] rounded-xl bg-linear-to-br from-[#F9FAFB] to-white">
              <div className="max-w-md mx-auto space-y-4">
                <div className="inline-flex p-4 bg-[#EF4444]/10 rounded-full">
                  <Heart className="h-12 w-12 text-[#EF4444]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#111827] mb-2">
                    No favorites yet
                  </h3>
                  <p className="text-[#6B7280]">
                    Start searching and click the heart icon to save talents
                    here
                  </p>
                </div>
                <Button
                  asChild
                  className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white shadow-sm"
                >
                  <Link href="/employer/search">
                    <Users className="mr-2 h-4 w-4" />
                    Find Talent
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {savedTalents.map(({ talent }) => (
                <SavedTalentCard key={talent.id} talent={talent} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Shortlists Tab */}
        <TabsContent value="shortlists" className="mt-6">
          {shortlists.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-[#E5E7EB] rounded-xl bg-linear-to-br from-[#F9FAFB] to-white">
              <div className="max-w-md mx-auto space-y-4">
                <div className="inline-flex p-4 bg-[#8B5CF6]/10 rounded-full">
                  <FolderOpen className="h-12 w-12 text-[#8B5CF6]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#111827] mb-2">
                    No shortlists created
                  </h3>
                  <p className="text-[#6B7280]">
                    Organize talents into custom lists for your projects
                  </p>
                </div>
                <Button
                  asChild
                  className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white shadow-sm"
                >
                  <Link href="/employer/search">
                    <Users className="mr-2 h-4 w-4" />
                    Find Talent
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {shortlists.map((list) => (
                <AccordionItem
                  key={list.id}
                  value={list.id}
                  className="border border-[#E5E7EB] rounded-xl px-6 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="hover:no-underline py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-linear-to-br from-[#8B5CF6]/10 to-[#8B5CF6]/5 flex items-center justify-center text-[#8B5CF6] border border-[#8B5CF6]/20">
                        <FolderOpen className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-lg text-[#111827]">
                          {list.name}
                        </h3>
                        <p className="text-sm text-[#6B7280] font-medium">
                          {list.items.length} talent
                          {list.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-6">
                    {list.items.length === 0 ? (
                      <div className="text-center py-8 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] mt-2">
                        <p className="text-sm text-[#6B7280] font-medium">
                          This list is empty
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
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
