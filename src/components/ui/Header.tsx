import Nav from "@/components/ui/Nav";


const Header = () => {
  return (
    <header>
      
      {/* Lines Section (First element) */}
      <section className="w-full mx-auto px-4">
        <div className="border-x border-zinc-200 dark:border-zinc-800 relative h-4"></div>
      </section>

      {/* Horizontal Line */}
      <hr className="border-zinc-200 dark:border-zinc-800" />

      {/* Header Content wrapped inside a section */}
      <section className="w-full mx-auto px-4">
        <div className="mx-auto flex items-center justify-between border-x border-zinc-200 dark:border-zinc-800 relative h-16">
          <Nav />
        </div>
      </section>
      {/* Horizontal Line */}
      <hr className="border-zinc-200 dark:border-zinc-800" />
      <section className="w-full mx-auto px-4">
        <div className="border-x border-zinc-200 dark:border-zinc-800 relative"></div>
      </section>

    </header>
  );
};

export default Header;
