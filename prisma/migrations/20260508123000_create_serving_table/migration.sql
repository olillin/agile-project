-- CreateTable
CREATE TABLE "Serving" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "lunchId" INTEGER NOT NULL,

    CONSTRAINT "Serving_pkey" PRIMARY KEY ("id")
);

-- Copy existing scalar-array servings into the new relation table.
INSERT INTO "Serving" ("date", "lunchId")
SELECT DISTINCT served_at::date, "id"
FROM "Lunch", unnest("servings") AS served_at
WHERE served_at IS NOT NULL;

-- AddForeignKey
ALTER TABLE "Serving" ADD CONSTRAINT "Serving_lunchId_fkey" FOREIGN KEY ("lunchId") REFERENCES "Lunch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "Serving_lunchId_date_key" ON "Serving"("lunchId", "date");

-- CreateIndex
CREATE INDEX "Serving_date_idx" ON "Serving"("date");

-- AlterTable
ALTER TABLE "Review" ADD COLUMN "servingId" INTEGER;

-- Preserve existing reviews by attaching them to the latest known serving for the reviewed lunch.
UPDATE "Review" AS review
SET "servingId" = (
    SELECT serving."id"
    FROM "Serving" AS serving
    WHERE serving."lunchId" = review."lunchId"
    ORDER BY serving."date" DESC
    LIMIT 1
);

-- If a reviewed lunch had no stored servings, create one on the review's posted day.
INSERT INTO "Serving" ("date", "lunchId")
SELECT DISTINCT review."posted"::date, review."lunchId"
FROM "Review" AS review
WHERE review."servingId" IS NULL
ON CONFLICT ("lunchId", "date") DO NOTHING;

UPDATE "Review" AS review
SET "servingId" = (
    SELECT serving."id"
    FROM "Serving" AS serving
    WHERE serving."lunchId" = review."lunchId"
    ORDER BY serving."date" DESC
    LIMIT 1
)
WHERE review."servingId" IS NULL;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "servingId" SET NOT NULL;

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_lunchId_fkey";

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_servingId_fkey" FOREIGN KEY ("servingId") REFERENCES "Serving"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "lunchId";

-- AlterTable
ALTER TABLE "Lunch" DROP COLUMN "servings";
