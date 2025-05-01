-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoImageId" TEXT,
ADD COLUMN     "seoTitle" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_seoImageId_fkey" FOREIGN KEY ("seoImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
