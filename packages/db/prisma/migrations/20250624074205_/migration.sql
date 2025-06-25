/*
  Warnings:

  - You are about to drop the column `editedImage` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `originalImage` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the `CreditPurchase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `originalImageId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CreditPurchase" DROP CONSTRAINT "CreditPurchase_userId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_postId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "editedImage",
DROP COLUMN "originalImage",
ADD COLUMN     "editedImageId" TEXT,
ADD COLUMN     "originalImageId" TEXT NOT NULL;

-- DropTable
DROP TABLE "CreditPurchase";

-- DropTable
DROP TABLE "Like";

-- DropTable
DROP TABLE "Post";
