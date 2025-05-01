import HeroSection from "@/components/sections/HeroSection";
import FeatureCardsIcon from "@/components/sections/FeatureCardsIcon";
import TestimonialsSection from "@/components/sections/testimonials/TestimonialsSection";
import LatestBlogPosts from "@/components/sections/LatestBlogPosts";


export default function Home() {
  return (
    <>
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <HeroSection />
        <FeatureCardsIcon />
        <TestimonialsSection />
        <LatestBlogPosts />
      </main>
    </>
  );
}
