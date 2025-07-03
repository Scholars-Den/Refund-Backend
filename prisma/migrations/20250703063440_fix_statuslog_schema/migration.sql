-- DropForeignKey
ALTER TABLE "StatusLog" DROP CONSTRAINT "StatusLog_updatedBy_fkey";

-- AlterTable
ALTER TABLE "StatusLog" ALTER COLUMN "updatedBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StatusLog" ADD CONSTRAINT "StatusLog_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
