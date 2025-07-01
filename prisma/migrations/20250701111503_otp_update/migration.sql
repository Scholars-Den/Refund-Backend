-- AlterTable
CREATE SEQUENCE otpstore_id_seq;
ALTER TABLE "OtpStore" ALTER COLUMN "id" SET DEFAULT nextval('otpstore_id_seq'),
ALTER COLUMN "otp" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" DROP DEFAULT;
ALTER SEQUENCE otpstore_id_seq OWNED BY "OtpStore"."id";
