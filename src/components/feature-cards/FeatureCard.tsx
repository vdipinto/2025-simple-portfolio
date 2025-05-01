"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { SeeMoreButton } from "@/components/ui/see-more-button"; // 👈 import SeeMoreButton
import Link from "next/link";
import Image from "next/image";

export type FeatureCardProps = {
  title: string;
  description: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  iconSizeClass?: string; // Optional icon size class
};

export function FeatureCard({
  title,
  description,
  href,
  Icon,
  iconSizeClass = "w-20 h-20", // Default if not provided
}: FeatureCardProps) {
  return (
    <Card className="h-full overflow-hidden transition hover:shadow-lg rounded-none">
      
      {/* Top part with background and icon */}
      <Link href={href} className="block group">
        <div className="relative w-full h-64 overflow-hidden">
          {/* Background Images */}
          <div className="absolute inset-0">
            {/* Light mode background */}
            <Image
              src="/images/background-light.png"
              alt="Background Light"
              fill
              className="object-cover block dark:hidden"
            />
            {/* Dark mode background */}
            <Image
              src="/images/background-dark.png"
              alt="Background Dark"
              fill
              className="object-contain hidden dark:block"
            />
          </div>

          {/* Icon */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className={`flex items-center justify-center ${iconSizeClass}`}>
              <Icon className="w-full h-full text-black dark:text-white" />
            </div>
          </div>
        </div>
      </Link>

      {/* Text Content */}
      <CardContent className="p-6 flex flex-col items-start gap-4">
        <CardTitle className="text-xl font-semibold">
          {title}
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          {description}
        </p>

        {/* See more button */}
        <SeeMoreButton href={href} />
      </CardContent>

    </Card>
  );
}
