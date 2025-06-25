-- DropForeignKey
ALTER TABLE "AppEvent" DROP CONSTRAINT "AppEvent_userId_fkey";

-- AlterTable
ALTER TABLE "AppEvent" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AppEvent" ADD CONSTRAINT "AppEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
