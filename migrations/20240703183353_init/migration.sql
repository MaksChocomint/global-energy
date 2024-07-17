/*
  Warnings:

  - You are about to drop the column `type` on the `Chart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chart" DROP COLUMN "type";

-- DropEnum
DROP TYPE "ChartType";
