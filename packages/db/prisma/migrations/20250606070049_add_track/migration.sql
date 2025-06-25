-- CreateTable
CREATE TABLE "AppEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "properties" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AppEvent" ADD CONSTRAINT "AppEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
