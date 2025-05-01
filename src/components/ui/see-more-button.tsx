import { ArrowRight } from "lucide-react"; 
import { Button } from "@/components/ui/button"; 
import Link from "next/link";

export function SeeMoreButton({ href }: { href: string }) {
  return (
    <Button asChild variant="ghost" className="text-primary hover:underline gap-2 px-0">
      <Link href={href}>
        See more
        <ArrowRight className="w-4 h-4" />
      </Link>
    </Button>
  );
}