/*
  Warnings:

  - You are about to drop the column `studentMobile` on the `Status` table. All the data in the column will be lost.
  - Added the required column `mobileNumber` to the `Status` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Status" DROP CONSTRAINT "Status_studentMobile_fkey";

-- AlterTable
ALTER TABLE "Status" DROP COLUMN "studentMobile",
ADD COLUMN     "mobileNumber" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_mobileNumber_fkey" FOREIGN KEY ("mobileNumber") REFERENCES "Student"("mobileNumber") ON DELETE CASCADE ON UPDATE CASCADE;
