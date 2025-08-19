"use client";

import dynamic from "next/dynamic";

// Load the real slider only on the client, after paint
const TestimonialsSection = dynamic(
  () => import("./TestimonialsSection"),
  { ssr: false }
);

export default function TestimonialsIsland() {
  return <TestimonialsSection />;
}