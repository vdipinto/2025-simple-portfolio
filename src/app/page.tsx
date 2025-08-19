import HeroSection from "@/components/sections/HeroSection";
import ServiceCards from "@/components/sections/ServiceCards";
import TestimonialsIsland from "@/components/sections/testimonials/TestimonialsIsland";
import FeaturedProject from "@/components/sections/FeaturedProject";
import LatestBlogPosts from "@/components/sections/LatestBlogPosts";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ServiceCards />
      {/* slider loads after paint; its CSS is no longer render-blocking */}
      <TestimonialsIsland />
      <FeaturedProject />
      <LatestBlogPosts />
    </main>
  );
}
