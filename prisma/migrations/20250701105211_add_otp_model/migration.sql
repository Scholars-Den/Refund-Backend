-- CreateTable
CREATE TABLE "OtpStore" (
    "id" INTEGER NOT NULL,
    "otp" INTEGER NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpStore_pkey" PRIMARY KEY ("id")
);
