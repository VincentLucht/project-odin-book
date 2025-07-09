/*
  Warnings:

  - Made the column `banned_at` on table `BannedUser` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BannedUser" ALTER COLUMN "banned_at" SET NOT NULL,
ALTER COLUMN "ban_duration" DROP NOT NULL;
