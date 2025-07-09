/*
  Warnings:

  - You are about to drop the column `is_edited` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "is_edited",
ADD COLUMN     "edited_at" TIMESTAMP(3);
