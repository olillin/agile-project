-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "posted" TIMESTAMP(3) NOT NULL,
    "servingId" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lunch" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "line" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "ecoScore" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Lunch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Serving" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "lunchId" INTEGER NOT NULL,

    CONSTRAINT "Serving_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "lunchId" INTEGER NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lunch_name_key" ON "Lunch"("name");

-- CreateIndex
CREATE INDEX "Serving_date_idx" ON "Serving"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Serving_lunchId_date_key" ON "Serving"("lunchId", "date");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_servingId_fkey" FOREIGN KEY ("servingId") REFERENCES "Serving"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Serving" ADD CONSTRAINT "Serving_lunchId_fkey" FOREIGN KEY ("lunchId") REFERENCES "Lunch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_lunchId_fkey" FOREIGN KEY ("lunchId") REFERENCES "Lunch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
