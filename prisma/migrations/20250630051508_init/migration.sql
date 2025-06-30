-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "rollNumber" TEXT NOT NULL,
    "dateOfAdmission" TIMESTAMP(3) NOT NULL,
    "session" TIMESTAMP(3) NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "accountNumber" INTEGER NOT NULL,
    "ifsc" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "relationWithStudent" TEXT NOT NULL,
    "amountDeposit" INTEGER NOT NULL,
    "remark" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);
