/*
  Warnings:

  - The values [IN_PROGRESS] on the enum `TournamentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `entryFee` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `maxAttempts` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `minParticipants` on the `Tournament` table. All the data in the column will be lost.
  - Added the required column `maxAttemptsPerUser` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerTicket` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticketTarget` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountPaidInRC` to the `TournamentAttempt` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TournamentVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'SUBSCRIBERS_ONLY');

-- CreateEnum
CREATE TYPE "PrizeType" AS ENUM ('ITEM', 'RIFFACOINS', 'OTHER');

-- CreateEnum
CREATE TYPE "PixKeyType" AS ENUM ('CPF', 'EMAIL', 'PHONE', 'RANDOM');

-- AlterEnum
BEGIN;
CREATE TYPE "TournamentStatus_new" AS ENUM ('PENDING_TRANSFER', 'SELLING', 'COMPLETED', 'CANCELED');
ALTER TABLE "Tournament" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Tournament" ALTER COLUMN "status" TYPE "TournamentStatus_new" USING ("status"::text::"TournamentStatus_new");
ALTER TYPE "TournamentStatus" RENAME TO "TournamentStatus_old";
ALTER TYPE "TournamentStatus_new" RENAME TO "TournamentStatus";
DROP TYPE "TournamentStatus_old";
ALTER TABLE "Tournament" ALTER COLUMN "status" SET DEFAULT 'SELLING';
COMMIT;

-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'ITEM_VALUE_REIMBURSEMENT';

-- DropForeignKey
ALTER TABLE "TournamentAttempt" DROP CONSTRAINT "TournamentAttempt_competitorId_fkey";

-- DropForeignKey
ALTER TABLE "TournamentAttempt" DROP CONSTRAINT "TournamentAttempt_tournamentId_fkey";

-- DropIndex
DROP INDEX "Tournament_gameId_idx";

-- DropIndex
DROP INDEX "Tournament_status_idx";

-- AlterTable
ALTER TABLE "PrizeClaim" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "entryFee",
DROP COLUMN "maxAttempts",
DROP COLUMN "minParticipants",
ADD COLUMN     "maxAttemptsPerUser" INTEGER NOT NULL,
ADD COLUMN     "pricePerTicket" INTEGER NOT NULL,
ADD COLUMN     "ticketTarget" INTEGER NOT NULL,
ADD COLUMN     "ticketsSold" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "visibility" "TournamentVisibility" NOT NULL DEFAULT 'PUBLIC',
ADD COLUMN     "winnerId" TEXT,
ALTER COLUMN "financialSnapshot" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TournamentAttempt" ADD COLUMN     "amountPaidInRC" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TournamentPrize" ADD COLUMN     "type" "PrizeType" NOT NULL DEFAULT 'ITEM';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "twoFactorAuthCode" TEXT,
ADD COLUMN     "twoFactorAuthCodeExpiresAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "FinancialProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pixKeyType" "PixKeyType" NOT NULL,
    "pixKey" TEXT NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateEarning" (
    "id" TEXT NOT NULL,
    "affiliateCodeId" TEXT NOT NULL,
    "originatingUserId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "commissionAmount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffiliateEarning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformSetting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "LeaderboardEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" TEXT,
    "period" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaderboardEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FinancialProfile_userId_key" ON "FinancialProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateEarning_transactionId_key" ON "AffiliateEarning"("transactionId");

-- CreateIndex
CREATE INDEX "AffiliateEarning_affiliateCodeId_idx" ON "AffiliateEarning"("affiliateCodeId");

-- CreateIndex
CREATE INDEX "AffiliateEarning_originatingUserId_idx" ON "AffiliateEarning"("originatingUserId");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_period_score_idx" ON "LeaderboardEntry"("period", "score");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_gameId_period_score_idx" ON "LeaderboardEntry"("gameId", "period", "score");

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_userId_period_gameId_key" ON "LeaderboardEntry"("userId", "period", "gameId");

-- CreateIndex
CREATE INDEX "Tournament_status_gameId_idx" ON "Tournament"("status", "gameId");

-- CreateIndex
CREATE INDEX "Tournament_winnerId_idx" ON "Tournament"("winnerId");

-- CreateIndex
CREATE INDEX "TournamentAttempt_competitorId_tournamentId_idx" ON "TournamentAttempt"("competitorId", "tournamentId");

-- AddForeignKey
ALTER TABLE "FinancialProfile" ADD CONSTRAINT "FinancialProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentAttempt" ADD CONSTRAINT "TournamentAttempt_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentAttempt" ADD CONSTRAINT "TournamentAttempt_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateEarning" ADD CONSTRAINT "AffiliateEarning_affiliateCodeId_fkey" FOREIGN KEY ("affiliateCodeId") REFERENCES "AffiliateCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateEarning" ADD CONSTRAINT "AffiliateEarning_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderboardEntry" ADD CONSTRAINT "LeaderboardEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderboardEntry" ADD CONSTRAINT "LeaderboardEntry_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
