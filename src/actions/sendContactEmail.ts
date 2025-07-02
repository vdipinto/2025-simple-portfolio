'use server'

import { Resend } from 'resend'
import { ContactFormSchema, ContactFormInput } from '@/schemas/contact'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(values: ContactFormInput) {
  // Validate input using Zod
  const result = ContactFormSchema.safeParse(values)

  if (!result.success) {
    return {
      success: false,
      error: 'Invalid input. Please check all fields.',
      issues: result.error.flatten().fieldErrors,
    }
  }

  const { name, email, message } = result.data

  try {
    await resend.emails.send({
      from: 'Contact Form <vito@vitodipinto.dev>',
      to: 'vito@vitodipinto.dev',
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('Resend email error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
