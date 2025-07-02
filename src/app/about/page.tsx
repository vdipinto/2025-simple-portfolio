'use client';

import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="px-6 py-4">
      <h1 className="text-center text-[7rem] leading-none font-bold mb-12 tracking-tight mb-24">
        Hey there.
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-6 items-start mb-10">
        <div>
          <Image
            src="/images/about-me-photo.png"
            alt="Vito Dipinto"
            width={500}
            height={500}
            className="rounded-md w-full h-auto object-cover"
            unoptimized
          />
        </div>

        <div>
          <div className="prose prose-neutral dark:prose-invert md:prose-lg lg:prose-xl max-w-prose">
            <p>
              Hey, I'm Vito! I've been making websites since 1998 and I currently work as a principal software engineer.
              I like working out, playing video games, and reading.
            </p>
            <p>
              Welcome to my spot on the web for writing, projects, tutorials, art, and anything else I want to put out there.
            </p>
            <p>
              My site has no ads, no affiliate links, no tracking or analytics, no sponsored posts, and no paywall. It's a
              space for self-expression and to share what I've learned with the world.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
