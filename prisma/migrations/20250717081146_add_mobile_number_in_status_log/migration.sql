/*
  Warnings:

  - You are about to drop the column `formId` on the `StatusLog` table. All the data in the column will be lost.
  - Added the required column `mobileNumber` to the `StatusLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StatusLog" DROP CONSTRAINT "StatusLog_formId_fkey";

-- DropIndex
DROP INDEX "StatusLog_formId_key";

-- AlterTable
ALTER TABLE "StatusLog" DROP COLUMN "formId",
ADD COLUMN     "mobileNumber" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "StatusLog" ADD CONSTRAINT "StatusLog_mobileNumber_fkey" FOREIGN KEY ("mobileNumber") REFERENCES "Student"("mobileNumber") ON DELETE CASCADE ON UPDATE CASCADE;
