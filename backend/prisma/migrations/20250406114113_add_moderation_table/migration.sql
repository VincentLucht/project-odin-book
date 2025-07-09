/*
  Warnings:

  - You are about to drop the column `approver_id` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `remover_id` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `approver_id` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `remover_id` on the `Post` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ModerationType" AS ENUM ('APPROVED', 'REMOVED');

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_approver_id_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_remover_id_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_approver_id_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_remover_id_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "approver_id",
DROP COLUMN "remover_id",
ADD COLUMN     "moderator_id" TEXT;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "approver_id",
DROP COLUMN "remover_id",
ADD COLUMN     "moderator_id" TEXT;

-- CreateTable
CREATE TABLE "PostModeration" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "moderator_id" TEXT NOT NULL,
    "action" "ModerationType" NOT NULL,
    "reason" VARCHAR(1000) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostModeration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentModeration" (
    "id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,
    "moderator_id" TEXT NOT NULL,
    "action" "ModerationType" NOT NULL,
    "reason" VARCHAR(1000) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentModeration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostModeration_post_id_key" ON "PostModeration"("post_id");

-- CreateIndex
CREATE INDEX "PostModeration_post_id_idx" ON "PostModeration"("post_id");

-- CreateIndex
CREATE INDEX "PostModeration_moderator_id_idx" ON "PostModeration"("moderator_id");

-- CreateIndex
CREATE UNIQUE INDEX "CommentModeration_comment_id_key" ON "CommentModeration"("comment_id");

-- CreateIndex
CREATE INDEX "CommentModeration_comment_id_idx" ON "CommentModeration"("comment_id");

-- CreateIndex
CREATE INDEX "CommentModeration_moderator_id_idx" ON "CommentModeration"("moderator_id");

-- AddForeignKey
ALTER TABLE "PostModeration" ADD CONSTRAINT "PostModeration_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostModeration" ADD CONSTRAINT "PostModeration_moderator_id_fkey" FOREIGN KEY ("moderator_id") REFERENCES "CommunityModerator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentModeration" ADD CONSTRAINT "CommentModeration_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentModeration" ADD CONSTRAINT "CommentModeration_moderator_id_fkey" FOREIGN KEY ("moderator_id") REFERENCES "CommunityModerator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
