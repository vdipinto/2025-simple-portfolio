/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "slug" SET DEFAULT 'default-slug';

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
