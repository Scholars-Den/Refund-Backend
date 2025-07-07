/*
  Warnings:

  - A unique constraint covering the columns `[formId]` on the table `StatusLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StatusLog_formId_key" ON "StatusLog"("formId");
