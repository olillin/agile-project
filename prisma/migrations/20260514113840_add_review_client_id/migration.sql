-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "clientId" TEXT;

-- CreateIndex
CREATE INDEX "Review_clientId_idx" ON "Review"("clientId");
