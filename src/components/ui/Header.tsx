import Link from "next/link";
import { Button } from "@/components/ui/button";
import Nav from "@/components/ui/Nav";
import MobileNav from "@/components/ui/mobile-nav";
import { ModeToggle } from "./toggle-mode";
import UserMenu from "@/components/ui/UserMenu";


const Header = () => {
  return (
    <header className="py-8 xl:py-12 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-4xl font-semibold">
            Vito<span className="text-primary">.</span>
          </h1>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden xl:flex items-center gap-9">
          <Nav />
          <Link href="/contact">
            <Button>Hire me</Button>
          </Link>
          <ModeToggle />
          <UserMenu />
        </div>

        {/* Mobile Nav */}
        <div className="xl:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
