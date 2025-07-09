/*
  Warnings:

  - Made the column `lock_comments` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "lock_comments" SET NOT NULL,
ALTER COLUMN "lock_comments" SET DEFAULT false;
