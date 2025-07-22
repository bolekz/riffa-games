-- DropForeignKey
ALTER TABLE "Tournament" DROP CONSTRAINT "Tournament_ownerId_fkey";

-- AlterTable
ALTER TABLE "Tournament" ALTER COLUMN "ownerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
