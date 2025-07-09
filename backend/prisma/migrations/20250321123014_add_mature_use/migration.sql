/*
  Warnings:

  - You are about to drop the column `updated_at` on the `CommunityRule` table. All the data in the column will be lost.
  - You are about to alter the column `text` on the `CommunityRule` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1000)` to `VarChar(500)`.

*/
-- AlterEnum
ALTER TYPE "PostType" ADD VALUE 'IMAGES';

-- AlterTable
ALTER TABLE "CommunityRule" DROP COLUMN "updated_at",
ALTER COLUMN "text" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_mature" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "UserAssignedFlair_community_flair_id_idx" ON "UserAssignedFlair"("community_flair_id");
