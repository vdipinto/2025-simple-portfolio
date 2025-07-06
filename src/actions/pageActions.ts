// src/actions/pageActions.ts
"use server";

import { prisma }          from "@/lib/db";
import { slugify }         from "@/lib/slugify";
import { z }               from "zod";

/* ------------------------------------------------------------------ */
/*  ⚙️  SHARED ZOD UTIL                                               */
/* ------------------------------------------------------------------ */
const PageTypeEnum = z.enum(["GENERAL", "SERVICE", "ABOUT"]);

const basePageSchema = {
  title: z.string().min(1, "Title is required"),
  slug:  z.string().min(1, "Slug is required"),
  published: z.boolean(),
  content: z.object({ type: z.literal("doc"), content: z.array(z.any()) })
            .refine(v => v.content.length > 0, { message: "Content cannot be empty"}),
  featuredImageId: z.string().optional().nullable(),
  seoImageId:      z.string().optional().nullable(),
  seoTitle:        z.string().min(1).max(60),
  seoDescription:  z.string().min(1).max(160),
  type:            PageTypeEnum.default("GENERAL")
};

export const CreatePageSchema = z.object(basePageSchema);
export const UpdatePageSchema = CreatePageSchema.extend({
  slug: z.string().min(1, "Missing page identifier")
});

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
        type: string;
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
        type: string;
        general: string;
      }>;
    };

export async function createPage(
  _prev: unknown,
  formData: FormData
): Promise<PageFormState> {
  const raw = {
    title:  formData.get("title")?.toString()  ?? "",
    slug:   formData.get("slug")?.toString()   ?? slugify(formData.get("title")?.toString() ?? ""),
    published: formData.get("published") === "on",
    content: JSON.parse(formData.get("content")?.toString() ?? "{}"),
    featuredImageId: formData.get("featuredImageId")?.toString() || null,
    seoImageId:      formData.get("seoImageId")?.toString()      || null,
    seoTitle:        formData.get("seoTitle")?.toString()        || "",
    seoDescription:  formData.get("seoDescription")?.toString()  || "",
    type:            formData.get("type")?.toString() as "GENERAL" | "SERVICE" | "ABOUT" || "GENERAL",
  };

  const data = CreatePageSchema.safeParse(raw);
  if (!data.success)
    return { success: false, errors: data.error.flatten().fieldErrors };

  if (await prisma.page.findUnique({ where: { slug: data.data.slug } }))
    return { success: false, errors: { slug: "Slug already exists" } };

  await prisma.page.create({
    data: {
      ...data.data,
      featuredImageId: data.data.featuredImageId ?? undefined,
      seoImageId:      data.data.seoImageId      ?? data.data.featuredImageId ?? undefined,
      publishedAt:     data.data.published ? new Date() : undefined,
    },
  });

  return { success: true, slug: data.data.slug };
}

export async function updatePage(
  _prev: unknown,
  formData: FormData
): Promise<UpdatePageResult> {
  const raw = {
    slug:   formData.get("slug")?.toString()   ?? "",
    title:  formData.get("title")?.toString()  ?? "",
    published: formData.get("published") === "on",
    content: JSON.parse(formData.get("content")?.toString() ?? "{}"),
    featuredImageId: formData.get("featuredImageId")?.toString() || null,
    seoImageId:      formData.get("seoImageId")?.toString()      || null,
    seoTitle:        formData.get("seoTitle")?.toString()        || "",
    seoDescription:  formData.get("seoDescription")?.toString()  || "",
    type:            formData.get("type")?.toString() as "GENERAL" | "SERVICE" | "ABOUT" || "GENERAL",
  };

  const res = UpdatePageSchema.safeParse(raw);
  if (!res.success)
    return { success: false, errors: res.error.flatten().fieldErrors };

  const page = await prisma.page.findUnique({ where: { slug: res.data.slug } });
  if (!page) return { success: false, message: "Page not found", errors: {} };

  await prisma.page.update({
    where: { slug: res.data.slug },
    data: {
      ...res.data,
      featuredImageId: res.data.featuredImageId,
      seoImageId:      res.data.seoImageId ?? res.data.featuredImageId ?? null,
      publishedAt:
        res.data.published && !page.publishedAt ? new Date() : page.publishedAt,
    },
  });

  return { success: true, published: res.data.published };
}

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
    console.error("🛑 Delete page error:", err);
    return { success: false, message: "Failed to delete page." };
  }
}
