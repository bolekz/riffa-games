/*
  Warnings:

  - You are about to alter the column `rcAmount` on the `Promotion` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `amountRC` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `riffaCoinsAvailable` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `riffaCoinsPending` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - A unique constraint covering the columns `[cpfHash]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ScoreOrder" AS ENUM ('ASC', 'DESC');

-- DropIndex
DROP INDEX "User_cpf_key";

-- AlterTable
ALTER TABLE "MiniGame" ADD COLUMN     "scoreOrder" "ScoreOrder" NOT NULL DEFAULT 'DESC';

-- AlterTable
ALTER TABLE "Promotion" ALTER COLUMN "rcAmount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "amountRC" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cpfHash" TEXT,
ADD COLUMN     "tradeUrl" TEXT,
ALTER COLUMN "riffaCoinsAvailable" SET DEFAULT 0,
ALTER COLUMN "riffaCoinsAvailable" SET DATA TYPE INTEGER,
ALTER COLUMN "riffaCoinsPending" SET DEFAULT 0,
ALTER COLUMN "riffaCoinsPending" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE INDEX "TournamentAttempt_tournamentId_idx" ON "TournamentAttempt"("tournamentId");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");

-- CreateIndex
CREATE INDEX "Transaction_type_status_idx" ON "Transaction"("type", "status");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpfHash_key" ON "User"("cpfHash");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");
