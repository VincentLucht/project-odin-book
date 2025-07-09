/*
  Warnings:

  - You are about to alter the column `reason` on the `CommentModeration` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1000)` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE "CommentModeration" ALTER COLUMN "reason" DROP NOT NULL,
ALTER COLUMN "reason" SET DATA TYPE VARCHAR(20);
