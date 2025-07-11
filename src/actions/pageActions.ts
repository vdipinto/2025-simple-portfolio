// src/actions/pageActions.ts
"use server";

import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slugify";
import { Prisma } from "@prisma/client";
import { CreatePageSchema } from "@/schemas/pageSchema";
import { UpdatePageSchema } from "@/schemas/pageSchema";


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
        type: string;
      }>;
    };

/* ------------------------------------------------------------------ */
/*  CREATE PAGE                                                       */
/* ------------------------------------------------------------------ */
// export async function createPage(_prev: unknown, formData: FormData) {
//   const raw = {
//     title: "Test",
//     slug: "test",
//     published: true,
//     content: {},
//     featuredImageId: null,
//     seoImageId: null,
//     seoTitle: "SEO",
//     seoDescription: "SEO Desc",
//     type: "BLOG",
//   };

//   console.log("CreatePageSchema is:", typeof CreatePageSchema);
//   const parsed = CreatePageSchema.safeParse(raw);
//   console.log("Parsed:", parsed);

//   return { success: true };
// }

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
    type: formData.get("type")?.toString() ?? "GENERAL",
  };

  console.log("🔍 type from form:", formData.get("type"));
  console.log("📦 Raw data object:", raw);

  const parsed = CreatePageSchema.safeParse(raw);
  if (!parsed.success) {
    console.error("❌ Zod validation failed:", parsed.error.flatten().fieldErrors);
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  console.log("✅ Zod parsed data:", parsed.data);

  const existing = await prisma.page.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    console.warn("⚠️ Slug already exists:", parsed.data.slug);
    return { success: false, errors: { slug: "Slug already exists" } };
  }

  const created = await prisma.page.create({
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
      type: parsed.data.type,
    },
  });

  console.log("✅ Page created in DB:", created.slug, "with type:", created.type);

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
    type: formData.get("type")?.toString() ?? "GENERAL",
  };

  console.log("🔍 type from form:", formData.get("type"));
  console.log("📦 Raw data (update):", raw);

  const parsed = UpdatePageSchema.safeParse(raw);
  if (!parsed.success) {
    console.error("❌ Zod validation failed (update):", parsed.error.flatten().fieldErrors);
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const current = await prisma.page.findUnique({ where: { slug: parsed.data.slug } });
  if (!current) {
    console.warn("⚠️ Page not found for slug:", parsed.data.slug);
    return { success: false, message: "Page not found", errors: {} };
  }

  const updated = await prisma.page.update({
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
        parsed.data.published && !current.publishedAt
          ? new Date()
          : current.publishedAt,
      type: parsed.data.type, // ✅ important
    },
  });

  console.log("✅ Page updated:", updated.slug, "with type:", updated.type);

  return { success: true, published: parsed.data.published };
}


/* ------------------------------------------------------------------ */
/*  DELETE PAGE                                                       */
/* ------------------------------------------------------------------ */
export async function deletePageBySlug(
  _prev: unknown,
  formData: FormData,
): Promise<{ success: boolean; message?: string }> {
  const slug = formData.get('slug')?.toString();

  if (!slug) {
    return { success: false, message: 'Missing page slug.' };
  }

  const { count } = await prisma.page.deleteMany({
    where: { slug },
  });

  return count > 0
    ? { success: true }
    : { success: false, message: 'Page not found.' };
}
