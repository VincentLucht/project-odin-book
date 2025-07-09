-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "downvote_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_vote_score" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "upvote_count" INTEGER NOT NULL DEFAULT 0;
