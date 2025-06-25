-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "thumbnailImageId" TEXT;

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "deletedAt" TIMESTAMP(3);
