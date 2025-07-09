-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "downvote_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "upvote_count" INTEGER NOT NULL DEFAULT 0;
