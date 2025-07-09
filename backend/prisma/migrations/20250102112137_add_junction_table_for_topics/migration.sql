/*
  Warnings:

  - You are about to drop the `CommunityTopic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MainCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommunityTopic" DROP CONSTRAINT "CommunityTopic_community_id_fkey";

-- DropForeignKey
ALTER TABLE "CommunityTopic" DROP CONSTRAINT "CommunityTopic_main_category_id_fkey";

-- DropTable
DROP TABLE "CommunityTopic";

-- DropTable
DROP TABLE "MainCategory";

-- CreateTable
CREATE TABLE "MainTopic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MainTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "main_category_id" TEXT NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityTopics" (
    "id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "topic_id" TEXT NOT NULL,

    CONSTRAINT "CommunityTopics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MainTopic_name_key" ON "MainTopic"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_name_key" ON "Topic"("name");

-- CreateIndex
CREATE INDEX "Topic_main_category_id_idx" ON "Topic"("main_category_id");

-- CreateIndex
CREATE INDEX "CommunityTopics_community_id_topic_id_idx" ON "CommunityTopics"("community_id", "topic_id");

-- CreateIndex
CREATE INDEX "CommunityTopics_topic_id_idx" ON "CommunityTopics"("topic_id");

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_main_category_id_fkey" FOREIGN KEY ("main_category_id") REFERENCES "MainTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityTopics" ADD CONSTRAINT "CommunityTopics_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityTopics" ADD CONSTRAINT "CommunityTopics_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
