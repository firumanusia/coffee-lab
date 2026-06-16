-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "verifyCode" TEXT,
ADD COLUMN     "verifyExpiry" TIMESTAMP(3);
