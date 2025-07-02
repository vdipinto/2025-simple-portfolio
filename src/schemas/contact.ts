import { z } from 'zod'

export const ContactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  message: z.string().min(5, { message: 'Message must be at least 5 characters' }),
  consent: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must agree to the privacy policy',
    }),
})

export type ContactFormInput = z.infer<typeof ContactFormSchema>
