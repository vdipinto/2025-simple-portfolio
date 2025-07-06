-- CreateEnum
CREATE TYPE "PageType" AS ENUM ('GENERAL', 'BLOG', 'CONTACT');

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "type" "PageType" NOT NULL DEFAULT 'GENERAL';
