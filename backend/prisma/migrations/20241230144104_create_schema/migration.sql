-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UPVOTE', 'DOWNVOTE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CONTRIBUTOR', 'BASIC');

-- CreateEnum
CREATE TYPE "CommunityType" AS ENUM ('PUBLIC', 'PRIVATE', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('BASIC', 'POLL');

-- CreateEnum
CREATE TYPE "FlairType" AS ENUM ('POST', 'USER', 'ALL');

-- CreateTable
CREATE TABLE "MainCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MainCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityTopic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "main_category_id" TEXT NOT NULL,
    "community_id" TEXT,

    CONSTRAINT "CommunityTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "display_name" VARCHAR(40),
    "profile_picture_url" TEXT,
    "description" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cake_day" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCommunity" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "UserCommunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Community" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "profile_picture_url_desktop" TEXT,
    "profile_picture_url_mobile" TEXT,
    "banner_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_private" BOOLEAN NOT NULL DEFAULT false,
    "is_mature" BOOLEAN NOT NULL DEFAULT false,
    "type" "CommunityType" NOT NULL,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityModerator" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,

    CONSTRAINT "CommunityModerator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "poster_id" TEXT NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "body" VARCHAR(40000) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "is_spoiler" BOOLEAN NOT NULL,
    "pinned_at" TIMESTAMP(3),
    "post_type" "PostType" NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostVote" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vote_type" "VoteType" NOT NULL,

    CONSTRAINT "PostVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" VARCHAR(10000) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "parent_comment_id" TEXT,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentVote" (
    "id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vote_type" "VoteType" NOT NULL,

    CONSTRAINT "CommentVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BannedUser" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "banned_at" TIMESTAMP(3) NOT NULL,
    "ban_reason" VARCHAR(500) NOT NULL,
    "ban_duration" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BannedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flair" (
    "id" TEXT NOT NULL,
    "emoji" VARCHAR(4),
    "name" VARCHAR(20) NOT NULL,
    "color" VARCHAR(7),
    "type" "FlairType"[],

    CONSTRAINT "Flair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityFlair" (
    "id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "flair_id" TEXT NOT NULL,

    CONSTRAINT "CommunityFlair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFlair" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "flair_id" TEXT NOT NULL,

    CONSTRAINT "UserFlair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostFlair" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "flair_id" TEXT NOT NULL,

    CONSTRAINT "PostFlair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "time_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profile_picture_url" TEXT,
    "is_group_chat" BOOLEAN NOT NULL DEFAULT false,
    "chat_description" VARCHAR(200),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_message_id" TEXT,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" VARCHAR(10000) NOT NULL,
    "time_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "is_system_message" BOOLEAN NOT NULL DEFAULT false,
    "chat_id" TEXT NOT NULL,
    "iv" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChats" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserChats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatAdmin" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,

    CONSTRAINT "ChatAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MainCategory_name_key" ON "MainCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityTopic_name_key" ON "CommunityTopic"("name");

-- CreateIndex
CREATE INDEX "CommunityTopic_main_category_id_idx" ON "CommunityTopic"("main_category_id");

-- CreateIndex
CREATE INDEX "CommunityTopic_community_id_idx" ON "CommunityTopic"("community_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserCommunity_id_key" ON "UserCommunity"("id");

-- CreateIndex
CREATE INDEX "UserCommunity_user_id_community_id_idx" ON "UserCommunity"("user_id", "community_id");

-- CreateIndex
CREATE UNIQUE INDEX "Community_name_key" ON "Community"("name");

-- CreateIndex
CREATE INDEX "CommunityModerator_community_id_user_id_idx" ON "CommunityModerator"("community_id", "user_id");

-- CreateIndex
CREATE INDEX "Post_title_idx" ON "Post"("title");

-- CreateIndex
CREATE INDEX "Post_created_at_idx" ON "Post"("created_at");

-- CreateIndex
CREATE INDEX "Post_community_id_idx" ON "Post"("community_id");

-- CreateIndex
CREATE INDEX "PostVote_post_id_idx" ON "PostVote"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "PostVote_post_id_user_id_key" ON "PostVote"("post_id", "user_id");

-- CreateIndex
CREATE INDEX "Comment_post_id_idx" ON "Comment"("post_id");

-- CreateIndex
CREATE INDEX "Comment_parent_comment_id_idx" ON "Comment"("parent_comment_id");

-- CreateIndex
CREATE INDEX "Comment_user_id_idx" ON "Comment"("user_id");

-- CreateIndex
CREATE INDEX "Comment_created_at_idx" ON "Comment"("created_at");

-- CreateIndex
CREATE INDEX "CommentVote_comment_id_idx" ON "CommentVote"("comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "CommentVote_comment_id_user_id_key" ON "CommentVote"("comment_id", "user_id");

-- CreateIndex
CREATE INDEX "BannedUser_user_id_community_id_idx" ON "BannedUser"("user_id", "community_id");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityFlair_community_id_flair_id_key" ON "CommunityFlair"("community_id", "flair_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserFlair_user_id_flair_id_key" ON "UserFlair"("user_id", "flair_id");

-- CreateIndex
CREATE UNIQUE INDEX "PostFlair_post_id_flair_id_key" ON "PostFlair"("post_id", "flair_id");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_last_message_id_key" ON "Chat"("last_message_id");

-- CreateIndex
CREATE INDEX "Chat_updated_at_idx" ON "Chat"("updated_at");

-- CreateIndex
CREATE INDEX "Message_chat_id_time_created_idx" ON "Message"("chat_id", "time_created");

-- CreateIndex
CREATE INDEX "Message_chat_id_user_id_idx" ON "Message"("chat_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserChats_user_id_chat_id_key" ON "UserChats"("user_id", "chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "ChatAdmin_user_id_chat_id_key" ON "ChatAdmin"("user_id", "chat_id");

-- AddForeignKey
ALTER TABLE "CommunityTopic" ADD CONSTRAINT "CommunityTopic_main_category_id_fkey" FOREIGN KEY ("main_category_id") REFERENCES "MainCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityTopic" ADD CONSTRAINT "CommunityTopic_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommunity" ADD CONSTRAINT "UserCommunity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommunity" ADD CONSTRAINT "UserCommunity_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Community" ADD CONSTRAINT "Community_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityModerator" ADD CONSTRAINT "CommunityModerator_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityModerator" ADD CONSTRAINT "CommunityModerator_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostVote" ADD CONSTRAINT "PostVote_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostVote" ADD CONSTRAINT "PostVote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentVote" ADD CONSTRAINT "CommentVote_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentVote" ADD CONSTRAINT "CommentVote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannedUser" ADD CONSTRAINT "BannedUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannedUser" ADD CONSTRAINT "BannedUser_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityFlair" ADD CONSTRAINT "CommunityFlair_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityFlair" ADD CONSTRAINT "CommunityFlair_flair_id_fkey" FOREIGN KEY ("flair_id") REFERENCES "Flair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFlair" ADD CONSTRAINT "UserFlair_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFlair" ADD CONSTRAINT "UserFlair_flair_id_fkey" FOREIGN KEY ("flair_id") REFERENCES "Flair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostFlair" ADD CONSTRAINT "PostFlair_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostFlair" ADD CONSTRAINT "PostFlair_flair_id_fkey" FOREIGN KEY ("flair_id") REFERENCES "Flair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_last_message_id_fkey" FOREIGN KEY ("last_message_id") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChats" ADD CONSTRAINT "UserChats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChats" ADD CONSTRAINT "UserChats_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatAdmin" ADD CONSTRAINT "ChatAdmin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatAdmin" ADD CONSTRAINT "ChatAdmin_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
