-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "is_group_chat" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ChatTracker" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "user1_id" TEXT NOT NULL,
    "user2_id" TEXT NOT NULL,

    CONSTRAINT "ChatTracker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatTracker_chat_id_key" ON "ChatTracker"("chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "ChatTracker_user1_id_user2_id_key" ON "ChatTracker"("user1_id", "user2_id");

-- AddForeignKey
ALTER TABLE "ChatTracker" ADD CONSTRAINT "ChatTracker_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatTracker" ADD CONSTRAINT "ChatTracker_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatTracker" ADD CONSTRAINT "ChatTracker_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
