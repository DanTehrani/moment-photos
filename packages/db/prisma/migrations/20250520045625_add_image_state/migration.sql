-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "paused" BOOLEAN NOT NULL DEFAULT false;
