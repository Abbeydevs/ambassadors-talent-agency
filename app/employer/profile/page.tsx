import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Building2, Globe, MapPin } from "lucide-react";

const EmployerProfilePage = async () => {
  const session = await auth();

  const profile = await db.employerProfile.findUnique({
    where: { userId: session?.user?.id },
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Company Profile</h1>
          <p className="text-muted-foreground">
            Manage your company information
          </p>
        </div>
        <Button asChild>
          <Link href="/employer/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="font-semibold">Description:</span>
              <p className="text-sm text-muted-foreground mt-1">
                {profile?.companyDescription || "No description added yet."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {profile?.websiteUrl || "No website linked"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {profile?.city && profile?.country
                  ? `${profile.city}, ${profile.country}`
                  : "Location not set"}
              </span>
            </div>

            <Button variant="outline" className="w-full mt-4">
              Edit Company Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployerProfilePage;
