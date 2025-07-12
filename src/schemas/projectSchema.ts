import { z } from "zod";

export const CreateProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  published: z.boolean(),
  content: z.any(), // TipTap JSON
  featuredImageId: z.string().optional().nullable(),
  seoImageId: z.string().optional().nullable(),
  seoTitle: z.string().min(1, "SEO Title is required").max(60),
  seoDescription: z.string().min(1, "SEO Description is required").max(160),
  liveUrl: z.union([
    z.string().url({ message: "Must be a valid URL" }),
    z.literal("")
  ]).optional(),
  repoUrl: z.union([
    z.string().url({ message: "Must be a valid URL" }),
    z.literal("")
  ]).optional(),
  category: z.string().min(1, "Category is required"),
});

export const UpdateProjectSchema = CreateProjectSchema.extend({
  slug: z.string().min(1, "Slug is required"),
});
