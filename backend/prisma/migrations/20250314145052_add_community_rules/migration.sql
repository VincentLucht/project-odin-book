-- CreateTable
CREATE TABLE "CommunityRule" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "text" VARCHAR(1000) NOT NULL,
    "community_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommunityRule_community_id_idx" ON "CommunityRule"("community_id");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityRule_community_id_order_key" ON "CommunityRule"("community_id", "order");

-- CreateIndex
CREATE INDEX "CommunityFlair_community_id_idx" ON "CommunityFlair"("community_id");

-- CreateIndex
CREATE INDEX "CommunityFlair_community_id_is_assignable_to_posts_idx" ON "CommunityFlair"("community_id", "is_assignable_to_posts");

-- CreateIndex
CREATE INDEX "CommunityFlair_community_id_is_assignable_to_users_idx" ON "CommunityFlair"("community_id", "is_assignable_to_users");

-- AddForeignKey
ALTER TABLE "CommunityRule" ADD CONSTRAINT "CommunityRule_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;
