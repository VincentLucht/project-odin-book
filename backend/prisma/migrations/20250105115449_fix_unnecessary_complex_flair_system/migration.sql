/*
  Warnings:

  - You are about to drop the column `flair_id` on the `CommunityFlair` table. All the data in the column will be lost.
  - You are about to drop the `Flair` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostFlair` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFlair` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `CommunityFlair` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CommunityFlair" DROP CONSTRAINT "CommunityFlair_flair_id_fkey";

-- DropForeignKey
ALTER TABLE "PostFlair" DROP CONSTRAINT "PostFlair_flair_id_fkey";

-- DropForeignKey
ALTER TABLE "PostFlair" DROP CONSTRAINT "PostFlair_post_id_fkey";

-- DropForeignKey
ALTER TABLE "UserFlair" DROP CONSTRAINT "UserFlair_flair_id_fkey";

-- DropForeignKey
ALTER TABLE "UserFlair" DROP CONSTRAINT "UserFlair_user_id_fkey";

-- DropIndex
DROP INDEX "CommunityFlair_community_id_flair_id_key";

-- AlterTable
ALTER TABLE "CommunityFlair" DROP COLUMN "flair_id",
ADD COLUMN     "color" VARCHAR(7),
ADD COLUMN     "emoji" VARCHAR(8),
ADD COLUMN     "is_assignable_to_posts" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_assignable_to_users" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" VARCHAR(20) NOT NULL;

-- DropTable
DROP TABLE "Flair";

-- DropTable
DROP TABLE "PostFlair";

-- DropTable
DROP TABLE "UserFlair";

-- DropEnum
DROP TYPE "FlairType";

-- CreateTable
CREATE TABLE "UserAssignedFlair" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "community_flair_id" TEXT NOT NULL,

    CONSTRAINT "UserAssignedFlair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostAssignedFlair" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "community_flair_id" TEXT NOT NULL,

    CONSTRAINT "PostAssignedFlair_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAssignedFlair_user_id_community_flair_id_key" ON "UserAssignedFlair"("user_id", "community_flair_id");

-- CreateIndex
CREATE UNIQUE INDEX "PostAssignedFlair_post_id_community_flair_id_key" ON "PostAssignedFlair"("post_id", "community_flair_id");

-- AddForeignKey
ALTER TABLE "UserAssignedFlair" ADD CONSTRAINT "UserAssignedFlair_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssignedFlair" ADD CONSTRAINT "UserAssignedFlair_community_flair_id_fkey" FOREIGN KEY ("community_flair_id") REFERENCES "CommunityFlair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostAssignedFlair" ADD CONSTRAINT "PostAssignedFlair_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostAssignedFlair" ADD CONSTRAINT "PostAssignedFlair_community_flair_id_fkey" FOREIGN KEY ("community_flair_id") REFERENCES "CommunityFlair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
