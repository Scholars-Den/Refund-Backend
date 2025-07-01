/*
  Warnings:

  - A unique constraint covering the columns `[mobileNumber]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mobileNumber` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "mobileNumber" TEXT NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "fatherName" DROP NOT NULL,
ALTER COLUMN "rollNumber" DROP NOT NULL,
ALTER COLUMN "dateOfAdmission" DROP NOT NULL,
ALTER COLUMN "session" DROP NOT NULL,
ALTER COLUMN "accountHolderName" DROP NOT NULL,
ALTER COLUMN "accountNumber" DROP NOT NULL,
ALTER COLUMN "ifsc" DROP NOT NULL,
ALTER COLUMN "bankName" DROP NOT NULL,
ALTER COLUMN "relationWithStudent" DROP NOT NULL,
ALTER COLUMN "amountDeposit" DROP NOT NULL,
ALTER COLUMN "remark" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_mobileNumber_key" ON "Student"("mobileNumber");
