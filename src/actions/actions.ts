"use server"

import { signIn } from "@/auth"; // ✅ Now works with `@/`
import { AuthError } from 'next-auth';
import { slugify } from '@/lib/slugify'
import { prisma } from "@/lib/db";
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { z } from 'zod';



const CreatePostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  category: z.string().min(1, 'Category is required'),
  published: z.boolean(),
  featuredImageId: z.string().optional().nullable(), // ✅ new line
  content: z.object({
    type: z.literal('doc'),
    content: z.array(z.any()),
  }).refine((val) => val.content.length > 0, {
    message: 'Post content cannot be empty',
  }),
})

type FormState =
  | { success: true; slug: string }
  | {
      success: false
      errors: Partial<{
        title: string
        slug: string
        category: string
        content: string
        featuredImageId: string // ✅ optional error support
        general: string
      }>
    }

const UpdatePostSchema = z.object({
  slug: z.string().min(1, 'Missing post identifier'),
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  published: z.boolean(),
  content: z.object({
    type: z.literal('doc'),
    content: z.array(z.any()),
  }).refine((val) => val.content.length > 0, {
    message: 'Post content cannot be empty',
  }),
  featuredImageId: z.string().nullable().optional(),
})
    
type UpdatePostResult =
  | { success: true; published: boolean }
  | {
      success: false
      message?: string
      errors?: Partial<{
        title: string
        slug: string
        category: string
        content: string
        general: string
      }>
    }

export async function createPost(prevState: any, formData: FormData): Promise<FormState> {
  try {
    const raw = {
      title: formData.get('title')?.toString() || '',
      slug:
        formData.get('slug')?.toString() ||
        slugify(formData.get('title')?.toString() || ''),
      category: formData.get('category')?.toString() || '',
      published: formData.get('published') === 'on',
      content: JSON.parse(formData.get('content')?.toString() || '{}'),
      featuredImageId: formData.get('featuredImageId')?.toString() || null, // ✅ add this
    }

    // Debug: log raw values
    console.log('🧾 Raw parsed data:', raw)

    // Validate input with Zod
    const data = CreatePostSchema.parse(raw)

    // Optional: check if slug already exists
    const existing = await prisma.post.findUnique({
      where: { slug: data.slug },
    })

    if (existing) {
      return {
        success: false,
        errors: {
          slug: 'A post with this slug already exists',
        },
      }
    }

    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        published: data.published,
        content: data.content,
        featuredImageId: formData.get('featuredImageId')?.toString() || null,
      },
    })

    return { success: true, slug: post.slug }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = err.flatten().fieldErrors
      return {
        success: false,
        errors: {
          title: errors.title?.[0],
          slug: errors.slug?.[0],
          category: errors.category?.[0],
          content: errors.content?.[0],
        },
      }
    }

    console.error('❌ Create post error:', err)
    return {
      success: false,
      errors: {
        general: 'Something went wrong. Please try again.',
      },
    }
  }
}

export async function updatePost(_: any, formData: FormData): Promise<UpdatePostResult> {
  try {
    const raw = {
      slug: formData.get('slug')?.toString() || '',
      title: formData.get('title')?.toString() || '',
      category: formData.get('category')?.toString() || '',
      published: (formData.get('published') === 'on') as boolean,
      content: JSON.parse(formData.get('content')?.toString() || '{}'),
      featuredImageId: formData.get('featuredImageId')?.toString() || null, // ✅ add this
    }

    console.log('🧾 Update raw data:', raw)

    const data = UpdatePostSchema.extend({
      featuredImageId: z.string().nullable().optional(),
    }).parse(raw)

    const updated = await prisma.post.update({
      where: { slug: data.slug },
      data: {
        title: data.title,
        category: data.category,
        published: data.published,
        content: data.content,
        featuredImageId: data.featuredImageId || null, // ✅ replace or remove image
      },
    })

    return { success: true, published: updated.published ?? false }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = err.flatten().fieldErrors
      return {
        success: false,
        errors: {
          title: errors.title?.[0],
          slug: errors.slug?.[0],
          category: errors.category?.[0],
          content: errors.content?.[0],
          featuredImageId: errors.featuredImageId?.[0],
        },
      }
    }

    console.error('❌ Update post error:', err)
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    }
  }
}




export async function deletePostBySlug(_: any, formData: FormData) {
  const slug = formData.get('slug') as string

  if (!slug) {
    return { success: false, message: 'Missing post slug.' }
  }

  try {
    await prisma.post.delete({ where: { slug } })
    return { success: true }
  } catch (err) {
    console.error('🛑 Delete post error:', err)
    return { success: false, message: 'Failed to delete post.' }
  }
}




export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
}


export async function register(_: unknown, formData: FormData) {
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const redirectTo = (formData.get('redirectTo') as string) || '/dashboard'

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return 'All fields are required.'
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match.'
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return 'User with that email already exists.'
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
  })

  // ✅ Automatically log in the user
  await signIn('credentials', {
    email,
    password,
    redirect: false, // prevent double redirect
  })

  // ✅ Now redirect after successful login
  redirect(redirectTo)
}

export async function getAllImages() {
  return await prisma.image.findMany({
    orderBy: { uploadedAt: 'desc' },
  })
}

export async function deleteImage(id: string) {
  try {
    await prisma.image.delete({
      where: { id },
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete image' }
  }
}

  