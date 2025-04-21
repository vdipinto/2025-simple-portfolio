"use server"

import { signIn } from "@/auth"; // ✅ Now works with `@/`
import { AuthError } from 'next-auth';
import { slugify } from '@/lib/slugify'
import { prisma } from "@/lib/db";
import { UpdatePostResult } from '@/types/post'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

export async function createPost(_: any, formData: FormData) {
  const errors: Record<string, string> = {}

  const title = formData.get('title') as string
  const slug = (formData.get('slug') as string) || slugify(title)
  const category = formData.get('category') as string
  const published = formData.get('published') === 'on'
  const contentRaw = formData.get('content')

  // 🧠 Validation
  if (!title || title.trim() === '') {
    errors.title = 'Title is required.'
  }

  if (!contentRaw || contentRaw === 'null' || contentRaw === '{}' || contentRaw === '') {
    errors.content = 'Post content cannot be empty.'
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }

  try {
    const content = JSON.parse(contentRaw as string)

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        category,
        published,
        content,
      },
    })

    return { success: true, slug: post.slug }
  } catch (error) {
    console.error('Create post error:', error)
    return {
      success: false,
      errors: { general: 'Something went wrong. Please try again.' },
    }
  }
}


export async function updatePost(_: any, formData: FormData): Promise<UpdatePostResult> {
  const formValues = Object.fromEntries(formData.entries())
  const errors: Record<string, string> = {}

  const title = formValues.title as string
  const slug = formValues.slug as string
  const category = formValues.category as string
  const published = formValues.published === 'on'
  const contentRaw = formValues.content as string

  // ✅ Validation
  if (!slug || slug.trim() === '') {
    errors.slug = 'Slug is required.'
  }

  if (!title || title.trim() === '') {
    errors.title = 'Title is required.'
  }

  if (!contentRaw || contentRaw === 'null' || contentRaw === '{}' || contentRaw === '') {
    errors.content = 'Post content cannot be empty.'
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }

  try {
    const content = JSON.parse(contentRaw)

    await prisma.post.update({
      where: { slug },
      data: {
        title,
        slug,
        category,
        published,
        content,
      },
    })

    return {
      success: true,
      slug,
      published, // <-- include this
      message: 'Post updated successfully!',
    }
  } catch (err: any) {
    console.error('Update post error:', err)

    if (err.code === 'P2002' && err.meta?.target?.includes('slug')) {
      return {
        success: false,
        errors: {
          slug: 'This slug is already in use.',
        },
      }
    }

    return {
      success: false,
      errors: {
        general: 'Failed to update post. Please try again.',
      },
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
  