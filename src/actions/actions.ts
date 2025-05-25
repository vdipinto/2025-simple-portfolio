"use server"

import { slugify } from '@/lib/slugify'
import { prisma } from "@/lib/db";
import bcrypt from 'bcryptjs'
import { z } from 'zod';
import { calculateReadingTime } from '@/lib/calculate-reading-time'



const CreatePostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  category: z.string().min(1, 'Category is required'),
  published: z.boolean(),
  content: z.object({
    type: z.literal('doc'),
    content: z.array(z.any()),
  }).refine((val) => val.content.length > 0, {
    message: 'Post content cannot be empty',
  }),
  featuredImageId: z.string().optional().nullable(),
  seoImageId: z.string().optional().nullable(),  // <-- Add this line
  seoTitle: z
    .string()
    .min(1, 'SEO title is required')
    .max(60, 'SEO title must be 60 characters or less'),
  seoDescription: z
    .string()
    .min(1, 'SEO description is required')
    .max(160, 'SEO description must be 160 characters or less'),
})

export type FormState =
  | { success: true; slug: string }
  | {
    success: false
    errors: Partial<{
      title: string
      slug: string
      category: string
      content: string
      featuredImageId: string
      seoTitle: string        // ✅ added
      seoDescription: string  // ✅ added
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
  seoImageId: z.string().nullable().optional(),  // <-- Add this line
  // ✅ With max length validations
  seoTitle: z
    .string()
    .min(1, 'SEO title is required')
    .max(60, 'SEO title must be 60 characters or less'),

  seoDescription: z
    .string()
    .min(1, 'SEO description is required')
    .max(160, 'SEO description must be 160 characters or less'),
})

export type UpdatePostResult =
  | { success: true; published: boolean }
  | {
      success: false;
      message?: string;
      errors: Partial<{
        title: string;
        slug: string;
        category: string;
        content: string;
        featuredImageId: string;
        seoTitle: string;
        seoDescription: string;
        general: string;
      }>;
    };

export async function createPost(
  _prevState: unknown,
  formData: FormData
): Promise<FormState> {
  try {
    const raw = {
      title: formData.get('title')?.toString() || '',
      slug:
        formData.get('slug')?.toString() ||
        slugify(formData.get('title')?.toString() || ''),
      category: formData.get('category')?.toString() || '',
      published: formData.get('published') === 'on',
      content: JSON.parse(formData.get('content')?.toString() || '{}'),
      featuredImageId: formData.get('featuredImageId')?.toString() || null,
      seoImageId: formData.get('seoImageId')?.toString() || null,
      seoTitle: formData.get('seoTitle')?.toString() || '',
      seoDescription: formData.get('seoDescription')?.toString() || '',
    }

    const data = CreatePostSchema.parse(raw)

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

    const normalizedName = data.category.trim()
    const displayName =
      normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1)
    const categorySlug = slugify(normalizedName.toLowerCase())

    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: {},
      create: {
        name: displayName,
        slug: categorySlug,
      },
    })

    // 🧠 Calculate reading time from tiptap content
    const readingTime = calculateReadingTime(data.content)

    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        published: data.published,
        publishedAt: data.published ? new Date() : undefined, // Fixed here
        featuredImageId: data.featuredImageId || undefined,
        seoImageId: data.seoImageId || data.featuredImageId || undefined,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        readingTime,
        categoryId: category.id, // Corrected here
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
          featuredImageId: errors.featuredImageId?.[0],
          seoTitle: errors.seoTitle?.[0],
          seoDescription: errors.seoDescription?.[0],
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




export async function updatePost(
  _prevState: unknown,
  formData: FormData
): Promise<UpdatePostResult> {
  try {
    const raw = {
      slug: formData.get("slug")?.toString() || "",
      title: formData.get("title")?.toString() || "",
      category: formData.get("category")?.toString() || "",
      published: formData.get("published") === "on",
      content: JSON.parse(formData.get("content")?.toString() || "{}"),
      featuredImageId: formData.get("featuredImageId")?.toString() || null,
      seoTitle: formData.get("seoTitle")?.toString() || "",
      seoDescription: formData.get("seoDescription")?.toString() || "",
      seoImageId: formData.get("seoImageId")?.toString() || null,
    };

    const data = UpdatePostSchema.parse(raw);

    const existingPost = await prisma.post.findUnique({
      where: { slug: data.slug },
    });

    if (!existingPost) {
      return {
        success: false,
        message: "Post not found",
        errors: {}, // Must include errors object
      };
    }

    const readingTime = calculateReadingTime(data.content);

    const normalizedName = data.category.trim();
    const displayName =
      normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1);
    const categorySlug = slugify(normalizedName.toLowerCase());

    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: {},
      create: {
        name: displayName,
        slug: categorySlug,
      },
    });

    const shouldSetPublishedAt = data.published && !existingPost.publishedAt;

    const updated = await prisma.post.update({
      where: { slug: data.slug },
      data: {
        title: data.title,
        content: data.content,
        published: data.published,
        publishedAt: shouldSetPublishedAt ? new Date() : undefined,
        readingTime,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoImageId: data.seoImageId || data.featuredImageId || null,
        featuredImageId: data.featuredImageId || null,
        categoryId: category.id,
      },
    });

    return { success: true, published: updated.published ?? false };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = err.flatten().fieldErrors;
      return {
        success: false,
        errors: {
          title: errors.title?.[0],
          slug: errors.slug?.[0],
          category: errors.category?.[0],
          content: errors.content?.[0],
          featuredImageId: errors.featuredImageId?.[0],
          seoTitle: errors.seoTitle?.[0],
          seoDescription: errors.seoDescription?.[0],
        },
      };
    }

    console.error("❌ Update post error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      errors: {}, // Always include errors object
    };
  }
}






export async function deletePostBySlug(_prevState: unknown, formData: FormData) {
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





export async function register(_: unknown, formData: FormData) {
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return "All fields are required.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return "User already exists.";

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { firstName, lastName, email, password: hashed },
  });

  // ✅ Don't sign in or redirect from here — handled on the client
  return null;
}


export async function getAllImages() {
  return await prisma.image.findMany({
    orderBy: { uploadedAt: 'desc' },
  })
}

export async function deleteImage(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.image.delete({
      where: { id },
    })
    return { success: true }
  } catch (_error) {
    console.error('🛑 Delete image error:', _error)
    return { success: false, error: 'Failed to delete image' }
  }
}
