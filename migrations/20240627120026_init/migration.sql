/*
  Warnings:

  - You are about to drop the column `texts` on the `Topic` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ChartType" ADD VALUE 'DOUGHNUT';
ALTER TYPE "ChartType" ADD VALUE 'POLARAREA';
ALTER TYPE "ChartType" ADD VALUE 'RADAR';
ALTER TYPE "ChartType" ADD VALUE 'SCATTER';
ALTER TYPE "ChartType" ADD VALUE 'BUBBLE';
ALTER TYPE "ChartType" ADD VALUE 'AREA';
ALTER TYPE "ChartType" ADD VALUE 'MIXED';

-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "texts";

-- CreateTable
CREATE TABLE "Text" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "topicId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Text_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Text" ADD CONSTRAINT "Text_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
