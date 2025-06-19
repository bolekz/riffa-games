/*
  Warnings:

  - You are about to drop the column `verificadoEmail` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificadoWhats` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[steamId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "verificadoEmail",
DROP COLUMN "verificadoWhats",
ADD COLUMN     "steamAvatar" TEXT,
ADD COLUMN     "steamId" TEXT,
ADD COLUMN     "steamName" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_steamId_key" ON "User"("steamId");
