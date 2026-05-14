-- DropIndex
DROP INDEX "Review_clientId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Review_clientId_servingId_key" ON "Review"("clientId", "servingId");
