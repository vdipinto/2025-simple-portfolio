import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getUserFromRequest } from "@/utils/auth-token"; // ✅ New helper
import { prisma } from "@/lib/db";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = await getUserFromRequest(req);

      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const saved = await prisma.image.create({
          data: {
            url: file.ufsUrl,
            alt: file.name,
            mimeType: file.type,
          },
        });

        console.log("✅ Image saved to DB:", saved);
        return { uploadedBy: metadata.userId };
      } catch (err: any) {
        console.error("❌ Upload failed:", err);
        throw new UploadThingError("Failed to save image");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
