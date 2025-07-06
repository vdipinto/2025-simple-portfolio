// src/actions/pageActions.ts
"use server";

import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slugify";
import { z } from "zod";
import { Prisma } from "@prisma/client";

/* ------------------------------------------------------------------ */
/*  ⚙️  ZOD SCHEMAS                                                   */
/* ------------------------------------------------------------------ */
const basePageSchema = {
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  published: z.boolean(),
  content: z
    .object({ type: z.literal("doc"), content: z.array(z.any()) })
    .refine((v) => v.content.length > 0, {
      message: "Content cannot be empty",
    }),
  featuredImageId: z.string().optional().nullable(),
  seoImageId: z.string().optional().nullable(),
  seoTitle: z.string().min(1).max(60),
  seoDescription: z.string().min(1).max(160),
} as const;

const CreatePageSchema = z.object(basePageSchema);
const UpdatePageSchema = CreatePageSchema.extend({
  slug: z.string().min(1, "Missing page identifier"),
});

/* ------------------------------------------------------------------ */
/*  TYPES                                                             */
/* ------------------------------------------------------------------ */
export type PageFormState =
  | { success: true; slug: string }
  | {
      success: false;
      errors: Partial<{
        title: string;
        slug: string;
        content: string;
        featuredImageId: string;
        seoTitle: string;
        seoDescription: string;
        general: string;
      }>;
    };

export type UpdatePageResult =
  | { success: true; published: boolean }
  | {
      success: false;
      message?: string;
      errors: Partial<{
        title: string;
        slug: string;
        content: string;
        featuredImageId: string;
        seoTitle: string;
        seoDescription: string;
        general: string;
      }>;
    };

/* ------------------------------------------------------------------ */
/*  CREATE PAGE                                                       */
/* ------------------------------------------------------------------ */
export async function createPage(
  _prev: unknown,
  formData: FormData
): Promise<PageFormState> {
  const raw = {
    title: formData.get("title")?.toString() ?? "",
    slug:
      formData.get("slug")?.toString() ??
      slugify(formData.get("title")?.toString() ?? ""),
    published: formData.get("published") === "on",
    content: JSON.parse(formData.get("content")?.toString() ?? "{}"),
    featuredImageId: formData.get("featuredImageId")?.toString() || null,
    seoImageId: formData.get("seoImageId")?.toString() || null,
    seoTitle: formData.get("seoTitle")?.toString() || "",
    seoDescription: formData.get("seoDescription")?.toString() || "",
  } as const;

  const parsed = CreatePageSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  if (await prisma.page.findUnique({ where: { slug: parsed.data.slug } })) {
    return { success: false, errors: { slug: "Slug already exists" } };
  }

  await prisma.page.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      published: parsed.data.published,
      publishedAt: parsed.data.published ? new Date() : undefined,
      content: parsed.data.content as Prisma.InputJsonValue,
      featuredImageId: parsed.data.featuredImageId ?? undefined,
      seoImageId:
        parsed.data.seoImageId ?? parsed.data.featuredImageId ?? undefined,
      seoTitle: parsed.data.seoTitle,
      seoDescription: parsed.data.seoDescription,
    },
  });

  return { success: true, slug: parsed.data.slug };
}

/* ------------------------------------------------------------------ */
/*  UPDATE PAGE                                                       */
/* ------------------------------------------------------------------ */
export async function updatePage(
  _prev: unknown,
  formData: FormData
): Promise<UpdatePageResult> {
  const raw = {
    slug: formData.get("slug")?.toString() ?? "",
    title: formData.get("title")?.toString() ?? "",
    published: formData.get("published") === "on",
    content: JSON.parse(formData.get("content")?.toString() ?? "{}"),
    featuredImageId: formData.get("featuredImageId")?.toString() || null,
    seoImageId: formData.get("seoImageId")?.toString() || null,
    seoTitle: formData.get("seoTitle")?.toString() || "",
    seoDescription: formData.get("seoDescription")?.toString() || "",
  } as const;

  const parsed = UpdatePageSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const current = await prisma.page.findUnique({ where: { slug: parsed.data.slug } });
  if (!current) return { success: false, message: "Page not found", errors: {} };

  await prisma.page.update({
    where: { slug: parsed.data.slug },
    data: {
      title: parsed.data.title,
      published: parsed.data.published,
      content: parsed.data.content as Prisma.InputJsonValue,
      featuredImageId: parsed.data.featuredImageId,
      seoImageId: parsed.data.seoImageId ?? parsed.data.featuredImageId ?? null,
      seoTitle: parsed.data.seoTitle,
      seoDescription: parsed.data.seoDescription,
      publishedAt:
        parsed.data.published && !current.publishedAt ? new Date() : current.publishedAt,
    },
  });

  return { success: true, published: parsed.data.published };
}

/* ------------------------------------------------------------------ */
/*  DELETE PAGE                                                       */
/* ------------------------------------------------------------------ */
export async function deletePageBySlug(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; message?: string }> {
  const slug = formData.get("slug")?.toString();
  if (!slug) return { success: false, message: "Missing page slug." };

  try {
    await prisma.page.delete({ where: { slug } });
    return { success: true };
  } catch (err) {
    console.error("🚑 Delete page error:", err);
    return { success: false, message: "Failed to delete page." };
  }
}
