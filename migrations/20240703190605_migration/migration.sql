/*
  Warnings:

  - Added the required column `type` to the `Chart` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChartType" AS ENUM ('LINE', 'BAR', 'PIE', 'DOUGHNUT', 'POLARAREA', 'RADAR', 'SCATTER', 'BUBBLE', 'AREA', 'MIXED');

-- AlterTable
ALTER TABLE "Chart" ADD COLUMN     "type" "ChartType" NOT NULL;
