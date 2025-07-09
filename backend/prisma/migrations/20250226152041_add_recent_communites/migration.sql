-- CreateTable
CREATE TABLE "RecentCommunities" (
    "id" TEXT NOT NULL,
    "interacted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "community_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "RecentCommunities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecentCommunities_community_id_user_id_key" ON "RecentCommunities"("community_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "RecentCommunities_interacted_at_key" ON "RecentCommunities"("interacted_at");

-- AddForeignKey
ALTER TABLE "RecentCommunities" ADD CONSTRAINT "RecentCommunities_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentCommunities" ADD CONSTRAINT "RecentCommunities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
