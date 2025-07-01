/*
  Warnings:

  - The `session` column on the `Student` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "batch" TEXT,
ALTER COLUMN "dateOfAdmission" SET DATA TYPE DATE,
DROP COLUMN "session",
ADD COLUMN     "session" INTEGER;
