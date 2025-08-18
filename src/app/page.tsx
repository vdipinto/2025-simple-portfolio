import HeroSection from "@/components/sections/HeroSection";
import ServiceCards from "@/components/sections/ServiceCards";
import TestimonialsSection from "@/components/sections/testimonials/TestimonialsSection";
import LatestBlogPosts from "@/components/sections/LatestBlogPosts";
import FeaturedProject from "@/components/sections/FeaturedProject";

export default function Home() {
  return (
    <>
      <main className="">
        <HeroSection />
        <ServiceCards />
        <TestimonialsSection />
        <FeaturedProject />
        <LatestBlogPosts />
      </main>
    </>
  );
}
