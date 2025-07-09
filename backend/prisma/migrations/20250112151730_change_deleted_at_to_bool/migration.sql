/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "deleted_at",
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;
