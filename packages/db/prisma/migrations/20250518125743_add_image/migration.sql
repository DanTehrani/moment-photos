-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "originalImage" TEXT NOT NULL,
    "editedImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);
