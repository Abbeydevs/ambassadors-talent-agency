import { auth } from "@/auth";
import { getTalentProfileByUserId } from "@/data/talent-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { User, Image as ImageIcon, Briefcase } from "lucide-react";

const TalentProfilePage = async () => {
  const session = await auth();
  const profile = await getTalentProfileByUserId(session?.user?.id || "");

  const completionPercentage = profile?.profileCompletion || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your portfolio and personal details
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={completionPercentage === 100 ? "default" : "secondary"}
            className="text-sm py-1 px-4"
          >
            {completionPercentage}% Complete
          </Badge>
          <Button asChild>
            <Link href="/talent/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Info</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile?.stageName || "Not Set"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {profile ? "Edit your basic details" : "Start setup"}
            </p>
            <Button variant="link" className="px-0 mt-2" asChild>
              <Link href="/talent/profile/edit/personal">
                Edit Details &rarr;
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Portfolio & Media
            </CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile?.photos?.length || 0} Photos
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Manage photos, videos, and audio
            </p>
            <Button variant="link" className="px-0 mt-2" asChild>
              <Link href="/talent/profile/edit/media">Upload Media &rarr;</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experience</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile?.experience?.length || 0} Credits
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Add your work history
            </p>
            <Button variant="link" className="px-0 mt-2" asChild>
              <Link href="/talent/profile/edit/experience">
                Add Credits &rarr;
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TalentProfilePage;
