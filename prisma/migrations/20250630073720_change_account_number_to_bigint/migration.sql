-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ACCOUNTS', 'ACCOUNTSHEAD', 'ADMIN', 'GUEST');

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "accountNumber" SET DATA TYPE BIGINT;

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'GUEST',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);
