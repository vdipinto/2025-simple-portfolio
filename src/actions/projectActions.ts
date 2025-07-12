"use server";

import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slugify";
import { Prisma } from "@prisma/client";
import { CreateProjectSchema } from "@/schemas/projectSchema";
import { UpdateProjectSchema } from "@/schemas/projectSchema";

export type UpdateProjectResult =
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
        liveUrl: string;
        repoUrl: string;
        general: string;
        category: string;
      }>;
    };



/* ------------------------------------------------------------------ */
/*  TYPES                                                             */
/* ------------------------------------------------------------------ */
export type ProjectFormState =
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
        liveUrl: string;
        repoUrl: string;
        general: string;
      }>;
    };

/* ------------------------------------------------------------------ */
/*  CREATE PROJECT                                                    */
/* ------------------------------------------------------------------ */
export async function createProject(
    _prev: unknown,
    formData: FormData
  ): Promise<ProjectFormState> {
    const raw = {
      title: formData.get("title")?.toString() ?? "",
      slug: formData.get("slug")?.toString() ?? slugify(formData.get("title")?.toString() ?? ""),
      published: formData.get("published") === "on",
      content: JSON.parse(formData.get("content")?.toString() ?? "{}"),
      featuredImageId: formData.get("featuredImageId")?.toString() || null,
      seoImageId: formData.get("seoImageId")?.toString() || null,
      seoTitle: formData.get("seoTitle")?.toString() || "",
      seoDescription: formData.get("seoDescription")?.toString() || "",
      liveUrl: formData.get("liveUrl")?.toString() || "",
      repoUrl: formData.get("repoUrl")?.toString() || "",
      category: formData.get("category")?.toString() || "",
    };
  
    console.log("📦 Raw project create form data:", raw);
  
    const parsed = CreateProjectSchema.safeParse(raw);
    if (!parsed.success) {
      console.error("❌ Zod validation failed (project create):", parsed.error.flatten().fieldErrors);
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      };
    }
  
    const exists = await prisma.project.findUnique({
      where: { slug: parsed.data.slug },
    });
  
    if (exists) {
      return {
        success: false,
        errors: { slug: "Slug already exists" },
      };
    }
  
    const normalizedName = parsed.data.category.trim();
    const displayName = normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1);
    const categorySlug = slugify(normalizedName.toLowerCase());
  
    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: {},
      create: {
        name: displayName,
        slug: categorySlug,
      },
    });
  
    const created = await prisma.project.create({
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
        liveUrl: parsed.data.liveUrl,
        repoUrl: parsed.data.repoUrl,
        categoryId: category.id,
      },
    });
  
    console.log("✅ Project created in DB:", created.slug);
  
    return { success: true, slug: created.slug };
  }
  


export async function updateProject(
    _prev: unknown,
    formData: FormData
  ): Promise<UpdateProjectResult> {
    const raw = {
      slug: formData.get("slug")?.toString() ?? "",
      title: formData.get("title")?.toString() ?? "",
      published: formData.get("published") === "on",
      content: JSON.parse(formData.get("content")?.toString() ?? "{}"),
      featuredImageId: formData.get("featuredImageId")?.toString() || null,
      seoImageId: formData.get("seoImageId")?.toString() || null,
      seoTitle: formData.get("seoTitle")?.toString() || "",
      seoDescription: formData.get("seoDescription")?.toString() || "",
      liveUrl: formData.get("liveUrl")?.toString() || "",
      repoUrl: formData.get("repoUrl")?.toString() || "",
      category: formData.get("category")?.toString() || "",
    };
  
    console.log("📦 Raw project update form data:", raw);
  
    const parsed = UpdateProjectSchema.safeParse(raw);
    if (!parsed.success) {
      console.error("❌ Zod validation failed (project update):", parsed.error.flatten().fieldErrors);
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      };
    }
  
    const current = await prisma.project.findUnique({
      where: { slug: parsed.data.slug },
    });
  
    if (!current) {
      return {
        success: false,
        message: "Project not found",
        errors: {},
      };
    }
  
    // Handle category (upsert)
    const normalizedName = parsed.data.category.trim();
    const displayName = normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1);
    const categorySlug = slugify(normalizedName.toLowerCase());
  
    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: {},
      create: {
        name: displayName,
        slug: categorySlug,
      },
    });
  
    const updated = await prisma.project.update({
      where: { slug: parsed.data.slug },
      data: {
        title: parsed.data.title,
        published: parsed.data.published,
        content: parsed.data.content as Prisma.InputJsonValue,
        featuredImageId: parsed.data.featuredImageId ?? undefined,
        seoImageId: parsed.data.seoImageId ?? parsed.data.featuredImageId ?? null,
        seoTitle: parsed.data.seoTitle,
        seoDescription: parsed.data.seoDescription,
        liveUrl: parsed.data.liveUrl,
        repoUrl: parsed.data.repoUrl,
        categoryId: category.id,
        publishedAt:
          parsed.data.published && !current.publishedAt
            ? new Date()
            : current.publishedAt,
      },
    });
    
  
    console.log("✅ Project updated in DB:", updated.slug);
  
    return { success: true, published: parsed.data.published };
  }
  


export async function deleteProjectBySlug(
    _prev: unknown,
    formData: FormData
  ): Promise<{ success: boolean; message?: string }> {
    const slug = formData.get("slug")?.toString();
  
    if (!slug) {
      return { success: false, message: "Missing project slug." };
    }
  
    const { count } = await prisma.project.deleteMany({
      where: { slug },
    });
  
    return count > 0
      ? { success: true }
      : { success: false, message: "Project not found." };
  }
  