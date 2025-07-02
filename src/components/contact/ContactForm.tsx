'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ContactFormSchema, ContactFormInput } from '@/schemas/contact'
import { sendContactEmail } from '@/actions/sendContactEmail'
import { useState } from 'react'

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'



export function ContactForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const form = useForm<ContactFormInput>({
        resolver: zodResolver(ContactFormSchema),
        defaultValues: {
            name: '',
            email: '',
            message: '',
            consent: false,
        },
    })

    const onSubmit = async (values: ContactFormInput) => {
        setIsLoading(true)
        const result = await sendContactEmail(values)
        setIsLoading(false)

        if (!result.success) {
            console.error(result.error)
            // Optional: show a toast or error feedback
        } else {
            form.reset()
            // Optional: show a success toast
            setIsSubmitted(true)
        }
    }

    return (
        <Form {...form}>
            {isSubmitted ? (
                <div className="space-y-6 max-w-lg">
                    <h2 className="text-2xl font-bold">Message Sent</h2>
                    <p>Thank you for contacting me. I will get back to you as soon as possible.</p>
                </div>
            ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Write your message here..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="consent"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                            <FormControl>
                                <Checkbox
                                    id="consent"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel htmlFor="consent" className="text-sm font-normal">
                                    I have read and understood the privacy policy and consent to the processing of my personal data.
                                </FormLabel>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="animate-spin w-4 h-4" />
                            Sending...
                        </span>
                    ) : (
                        'Send Message'
                    )}
                </Button>
            </form>
             )}
        </Form>
    )
}
