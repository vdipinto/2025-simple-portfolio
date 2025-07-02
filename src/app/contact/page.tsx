'use client'

import { ContactForm } from '@/components/contact/ContactForm'

export default function ContactPage() {
  return (
    <section className="w-full mx-auto px-4 border-t border-b border-x border-zinc-200 dark:border-zinc-800">
      <div className="border-x border-zinc-200 dark:border-zinc-800">
        {/* Top: Text */}
        <div className="w-full border-b border-zinc-200 dark:border-zinc-800 px-4 py-16 flex flex-col items-center text-center">
          <div className="space-y-4 sm:space-y-6 max-w-4xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl dark:text-white">
              Get in Touch
            </h2>
            <p className="text-base md:text-lg text-balance max-w-md text-zinc-600 dark:text-zinc-300 mx-auto">
              Have a project in mind or just want to connect? Book a quick call with me or send a message using the form.
            </p>
          </div>
        </div>

        {/* Bottom: Form */}
        <div className="px-4 py-12 flex justify-center">
          <div className="w-full max-w-2xl flex flex-col items-center">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
