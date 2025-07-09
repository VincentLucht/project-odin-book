/*
  Warnings:

  - You are about to alter the column `reason` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - Added the required column `subject` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "subject" VARCHAR(20) NOT NULL,
ALTER COLUMN "reason" SET DATA TYPE VARCHAR(500);
