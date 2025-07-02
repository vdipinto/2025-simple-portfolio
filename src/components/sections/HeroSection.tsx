"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import Link from 'next/link'

const HeroSection = () => {
  return (
    <section className="w-full mx-auto px-4 overflow-hidden relative bg-black text-white">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0">
        <div className="grid-3d-effect w-full h-full">
          {/* Vertical Lines */}
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute top-0 h-full w-px bg-orange-400 animate-vertical-pulse"
              style={{
                left: `${i * 2.5}%`,
                transform: `translateX(-50%)`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}

          {/* Horizontal Lines */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute left-0 w-full h-px bg-orange-400 animate-horizontal-pulse"
              style={{
                bottom: `${i * 3}%`,
                transform: `translateY(50%)`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Horizon Glow Line */}
      <div className="absolute bottom-[67%] left-0 w-full h-px bg-orange-400 z-0 horizon-glow" />

      {/* Hero Content */}
      <div className="relative z-0 min-h-[600px] lg:h-[700px] flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6 -mt-16 drop-shadow-[0_0_10px_rgba(255,150,0,0.8)]">
          HELLO, MY NAME IS VITO, I make websites <span className="inline-block">🚀</span>
        </h1>
        <p className="text-xl text-white mb-4 max-w-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
          Front-end developer who loves crafting beautiful web experiences.
        </p>
        <p className="text-xl text-white mb-8 max-w-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
          I&rsquo;m open to new opportunities and enjoy sharing what I learn on my blog.
        </p>


        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/contact">
            {/* Contact Me Button */}
            <Button
              className="w-full sm:w-auto px-8 py-5 text-lg font-semibold border border-white 
     text-white bg-primary 
     hover:bg-white hover:text-black 
     dark:bg-black dark:text-white 
     dark:hover:bg-white dark:hover:text-black 
     transition-colors"
            >
              Contact Me
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>


          {/* See My CV Button */}
          <a
            href="/Vito-Dipinto.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              className="w-full sm:w-auto px-8 py-5 text-lg font-semibold border border-white 
               text-white bg-primary 
               hover:bg-white hover:text-black 
               dark:bg-black dark:text-white 
               dark:hover:bg-white dark:hover:text-black 
               transition-colors"
            >
              View My CV
              <Download className="ml-2 h-6 w-6" />
            </Button>
          </a>



        </div>



      </div>
    </section>
  );
};

export default HeroSection;
