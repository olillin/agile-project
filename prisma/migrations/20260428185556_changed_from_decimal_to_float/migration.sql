/*
  Warnings:

  - You are about to alter the column `amount` on the `Ingredient` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `eco_score` on the `Lunch` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Ingredient" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Lunch" ALTER COLUMN "eco_score" SET DATA TYPE DOUBLE PRECISION;
