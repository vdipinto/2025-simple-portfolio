"use client"

import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { testimonials } from "./testimonials-data"
import Image from "next/image"

export default function TestimonialsSection() {
  const [sliderRef, instanceRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 0,
    },
    loop: true,
    breakpoints: {
      "(max-width: 1024px)": {
        slides: { perView: 2, spacing: 0 },
      },
      "(max-width: 640px)": {
        slides: { perView: 1, spacing: 0 },
      },
    },
  })

  return (
    <>
      {/* Title Section */}
      <section className="w-full mx-auto px-4 border-b border-x border-zinc-200 dark:border-zinc-800">
        <div className="border-x border-zinc-200 dark:border-zinc-800 relative -mt-px -mb-px">
          <div className="w-full border-y border-y-zinc-200 dark:border-y-zinc-800 py-6 -my-px">
            <h2 className="text-center font-mono text-[10px] tracking-[2px] text-zinc-600 dark:text-zinc-400 uppercase">
              Testimonials
            </h2>
          </div>
        </div>
      </section>

      {/* Slider Section */}
      <section className="w-full mx-auto px-4 border-b border-x border-zinc-200 dark:border-zinc-800">
        <div ref={sliderRef} className="keen-slider">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="keen-slider__slide">
              <div className="border-x bg-card text-card-foreground shadow h-full overflow-hidden transition hover:shadow-lg rounded-none flex flex-col p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.position}</div>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4 flex-1 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="flex">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <svg
                      key={starIndex}
                      className={`w-5 h-5 ${starIndex < testimonial.rating ? "text-yellow-400" : "text-zinc-300"
                        }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.965a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.286 3.965c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.838-.197-1.539-1.118l1.286-3.965a1 1 0 00-.364-1.118L2.21 9.392c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.965z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Arrows Section */}
      <section className="w-full mx-auto px-4 border-b border-x border-zinc-200 dark:border-zinc-800">
        <div className="border-x border-zinc-200 dark:border-zinc-800 relative -mt-px -mb-px">
          <div className="w-full border-y border-y-zinc-200 dark:border-y-zinc-800 py-6 -my-px flex items-center justify-center gap-6">
            <button
              onClick={() => instanceRef.current?.prev()}
              className="w-32 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-center"
            >
              ← Previous
            </button>
            <button
              onClick={() => instanceRef.current?.next()}
              className="w-32 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-center"
            >
              Next →
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
