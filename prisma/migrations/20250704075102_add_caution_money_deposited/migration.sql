/*
  Warnings:

  - You are about to drop the column `amountDeposit` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "amountDeposit",
ADD COLUMN     "cautionMoneyDeposited" INTEGER;
