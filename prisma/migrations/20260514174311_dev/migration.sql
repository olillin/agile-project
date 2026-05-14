/*
  Warnings:

  - You are about to drop the column `servingId` on the `Review` table. All the data in the column will be lost.
  - Added the required column `lunchId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_servingId_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "servingId",
ADD COLUMN     "lunchId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_lunchId_fkey" FOREIGN KEY ("lunchId") REFERENCES "Lunch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
