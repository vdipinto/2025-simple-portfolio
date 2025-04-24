import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth()
      console.log("🔐 Upload session:", session)

      if (!session?.user?.id) {
        console.error("🚫 No user session found")
        throw new UploadThingError("Unauthorized")
      }

      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
        try {
          console.log("✅ File received:", file)
          console.log("🙋 Uploaded by:", metadata.userId)
      
          const saved = await prisma.image.create({
            data: {
              url: file.url,
              alt: file.name,
              mimeType: file.type,
            },
          })
      
          console.log("📸 Image saved to DB:", saved)
          return { uploadedBy: metadata.userId }
        } catch (err: any) {
          console.error("❌ Error saving image to DB:", err?.message || err)
          if (err instanceof Error && "stack" in err) {
            console.error(err.stack)
          }
          throw new UploadThingError("Database insert failed")
        }
      })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
