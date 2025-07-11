// import { z } from "zod";
// import { PageType } from "@prisma/client";

// export const CreatePageSchema = z.object({
//   title: z.string(),
//   slug: z.string(),
//   published: z.boolean(),
//   content: z.any(),
//   featuredImageId: z.string().nullable().optional(),
//   seoImageId: z.string().nullable().optional(),
//   seoTitle: z.string(),
//   seoDescription: z.string(),
//   type: z.nativeEnum(PageType),
// });

import { z } from "zod";
import { PageType } from "@prisma/client";

export const basePageSchema = {
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  published: z.boolean(),
  content: z
    .object({
      type: z.literal("doc"),
      content: z.array(z.any()),
    })
    .refine((v) => v.content.length > 0, {
      message: "Content cannot be empty",
    }),
  featuredImageId: z.string().optional().nullable(),
  seoImageId: z.string().optional().nullable(),
  seoTitle: z.string().min(1).max(60),
  seoDescription: z.string().min(1).max(160),
  type: z.nativeEnum(PageType),
};

export const CreatePageSchema = z.object(basePageSchema);
export const UpdatePageSchema = CreatePageSchema;