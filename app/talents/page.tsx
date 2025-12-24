import { getAllTalents } from "@/data/public-talents";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { TalentSearchInput } from "@/components/talent/talent-search-input";
import { TalentFilters } from "@/components/talent/talent-filter";
import { PublicTalentCard } from "@/components/talent/public-talent-card";

interface TalentsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    location?: string;
    gender?: string;
    minAge?: string;
    maxAge?: string;
    page?: string;
  }>;
}

export default async function TalentsPage({ searchParams }: TalentsPageProps) {
  const params = await searchParams;

  const filters = {
    query: params.q,
    category: params.category,
    location: params.location,
    gender: params.gender,
    minAge: params.minAge ? Number(params.minAge) : undefined,
    maxAge: params.maxAge ? Number(params.maxAge) : undefined,
    page: params.page ? Number(params.page) : 1,
  };

  const { talents, metadata } = await getAllTalents(filters);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Discover Talent
          </h1>
          <p className="text-slate-600 mb-8 max-w-2xl">
            Connect with thousands of actors, models, and creatives. Use filters
            to find the perfect match for your next project.
          </p>
          <TalentSearchInput />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block lg:col-span-1">
            <TalentFilters />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Showing <strong>{talents.length}</strong> of{" "}
                <strong>{metadata.totalCount}</strong> talents
              </p>
            </div>

            {talents.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-xl border border-dashed">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">
                  No talents found
                </h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-2">
                  Try adjusting your search terms or filters to find what you
                  are looking for.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {talents.map((talent) => (
                  <PublicTalentCard key={talent.id} talent={talent} />
                ))}
              </div>
            )}

            {metadata.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  disabled={!metadata.hasPrevPage}
                  asChild={metadata.hasPrevPage}
                >
                  {metadata.hasPrevPage ? (
                    <Link href={`/talents?page=${metadata.currentPage - 1}`}>
                      <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                    </Link>
                  ) : (
                    <span>
                      <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                    </span>
                  )}
                </Button>

                <div className="flex items-center px-4 text-sm font-medium">
                  Page {metadata.currentPage} of {metadata.totalPages}
                </div>

                <Button
                  variant="outline"
                  disabled={!metadata.hasNextPage}
                  asChild={metadata.hasNextPage}
                >
                  {metadata.hasNextPage ? (
                    <Link href={`/talents?page=${metadata.currentPage + 1}`}>
                      Next <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  ) : (
                    <span>
                      Next <ChevronRight className="h-4 w-4 ml-2" />
                    </span>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
