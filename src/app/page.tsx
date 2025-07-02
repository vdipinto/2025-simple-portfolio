import HeroSection from "@/components/sections/HeroSection";
import FeatureCardsIcon from "@/components/sections/FeatureCardsIcon";
import TestimonialsSection from "@/components/sections/testimonials/TestimonialsSection";
import LatestBlogPosts from "@/components/sections/LatestBlogPosts";
import FeaturedProject from "@/components/sections/FeaturedProject"; // ✅ Import

export default function Home() {
  return (
    <>
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <HeroSection />
        <FeatureCardsIcon />
        <TestimonialsSection />
        <FeaturedProject />
        <LatestBlogPosts />
      </main>
    </>
  );
}
