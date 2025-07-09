/*
  Warnings:

  - You are about to drop the column `replies_enabled` on the `UserSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "replies_enabled",
ADD COLUMN     "mods_enabled" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "community_enabled" SET DEFAULT true,
ALTER COLUMN "posts_enabled" SET DEFAULT true,
ALTER COLUMN "comments_enabled" SET DEFAULT true,
ALTER COLUMN "chats_enabled" SET DEFAULT true,
ALTER COLUMN "follows_enabled" SET DEFAULT true;
