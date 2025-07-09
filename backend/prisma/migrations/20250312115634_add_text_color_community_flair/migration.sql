/*
  Warnings:

  - Added the required column `textColor` to the `CommunityFlair` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommunityFlair" ADD COLUMN     "textColor" VARCHAR(7) NOT NULL;

-- CreateIndex
CREATE INDEX "Post_community_id_created_at_deleted_at_idx" ON "Post"("community_id", "created_at", "deleted_at");
