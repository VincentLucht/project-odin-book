/*
  Warnings:

  - You are about to drop the column `post_flair_required` on the `Community` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Community" DROP COLUMN "post_flair_required",
ADD COLUMN     "is_post_flair_required" BOOLEAN NOT NULL DEFAULT false;
