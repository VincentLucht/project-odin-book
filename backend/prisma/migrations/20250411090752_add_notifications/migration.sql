-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('COMMUNITYMESSAGE', 'POSTREPLY', 'COMMENTREPLY', 'MODMESSAGE', 'CHATMESSAGE', 'NEWFOLLOWER');

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "community_enabled" BOOLEAN NOT NULL,
    "posts_enabled" BOOLEAN NOT NULL,
    "comments_enabled" BOOLEAN NOT NULL,
    "replies_enabled" BOOLEAN NOT NULL,
    "chats_enabled" BOOLEAN NOT NULL,
    "follows_enabled" BOOLEAN NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "NotificationType" NOT NULL,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_user_id_key" ON "UserSettings"("user_id");

-- CreateIndex
CREATE INDEX "Notification_sender_id_receiver_id_idx" ON "Notification"("sender_id", "receiver_id");

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
