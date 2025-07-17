/*
  Warnings:

  - A unique constraint covering the columns `[mobileNumber]` on the table `Status` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mobileNumber]` on the table `StatusLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Status_mobileNumber_key" ON "Status"("mobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "StatusLog_mobileNumber_key" ON "StatusLog"("mobileNumber");
