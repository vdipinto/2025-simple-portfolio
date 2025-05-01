import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export type TestimonialProps = {
  quote: string;
  name: string;
  position: string;
  image: string;
  rating: number; // number of stars (e.g., 5)
};

export function TestimonialCard({ quote, name, position, image, rating }: TestimonialProps) {
  return (
    <Card className="">
      {/* Card Content */}
      <CardContent className="flex flex-col items-center text-center p-6 gap-4 flex-grow">
        {/* Stars */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className={index < rating ? "text-yellow-400" : "text-gray-300"}>
              ★
            </span>
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-muted-foreground text-sm italic">
          “{quote}”
        </blockquote>

        {/* User Info */}
        <div className="flex flex-col items-center mt-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden mb-2">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
          <div className="font-medium">{name}</div>
          <div className="text-muted-foreground text-xs">{position}</div>
        </div>
      </CardContent>
    </Card>
  );
}
