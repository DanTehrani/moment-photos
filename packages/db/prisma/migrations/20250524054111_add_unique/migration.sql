/*
  Warnings:

  - A unique constraint covering the columns `[userId,albumId]` on the table `UserAlbum` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserAlbum_userId_albumId_key" ON "UserAlbum"("userId", "albumId");
