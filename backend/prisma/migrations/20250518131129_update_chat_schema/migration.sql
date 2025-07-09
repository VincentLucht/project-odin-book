/*
  Warnings:

  - You are about to drop the column `is_group_chat` on the `Chat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_user_id_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "is_group_chat";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "content" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "UserChats" ADD COLUMN     "is_muted" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
