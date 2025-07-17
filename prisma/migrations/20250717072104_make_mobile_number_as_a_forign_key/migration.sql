/*
  Warnings:

  - You are about to drop the column `formId` on the `Status` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mobileNumber]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studentMobile` to the `Status` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Status" DROP CONSTRAINT "Status_formId_fkey";

-- AlterTable
ALTER TABLE "Status" DROP COLUMN "formId",
ADD COLUMN     "studentMobile" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_mobileNumber_key" ON "Student"("mobileNumber");

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_studentMobile_fkey" FOREIGN KEY ("studentMobile") REFERENCES "Student"("mobileNumber") ON DELETE CASCADE ON UPDATE CASCADE;
