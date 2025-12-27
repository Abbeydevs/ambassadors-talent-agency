import { HeroSection } from "@/components/home/hero-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { FeaturedJobsSection } from "@/components/home/featured-jobs";
import { TalentCategories } from "@/components/home/talent-categories";
import { SuccessStoriesSection } from "@/components/home/success-stories";
import { TrainingTeaser } from "@/components/home/training-teaser";
import { StatsSection } from "@/components/home/stats-section";
import { Testimonials } from "@/components/home/testimonials";
import { CTASection } from "@/components/home/cta-section";
import { HomeBlogSection } from "@/components/home/home-blog-section";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <HeroSection />

      <HowItWorks />

      <FeaturedJobsSection />

      <TalentCategories />

      <SuccessStoriesSection />

      <TrainingTeaser />

      <StatsSection />

      <Testimonials />

      <CTASection />

      <HomeBlogSection />
    </main>
  );
}
