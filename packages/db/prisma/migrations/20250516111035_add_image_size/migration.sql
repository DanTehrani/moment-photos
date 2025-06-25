/*
  Warnings:

  - Added the required column `imageHeight` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageWidth` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "imageHeight" INTEGER NOT NULL,
ADD COLUMN     "imageWidth" INTEGER NOT NULL;
