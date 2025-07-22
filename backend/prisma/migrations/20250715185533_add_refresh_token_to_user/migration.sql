/*
  Warnings:

  - You are about to drop the column `amountBRL` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `amountRC` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "amountBRL",
DROP COLUMN "amountRC",
ADD COLUMN     "amountBrl" DECIMAL(65,30),
ADD COLUMN     "amountRc" INTEGER;

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "UserEvent_userId_idx" ON "UserEvent"("userId");
