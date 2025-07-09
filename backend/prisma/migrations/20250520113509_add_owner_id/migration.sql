/*
  Warnings:

  - A unique constraint covering the columns `[owner_id]` on the table `ChatTracker` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `owner_id` to the `ChatTracker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatTracker" ADD COLUMN     "owner_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "NotificationChat" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "NotificationChat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatTracker_owner_id_key" ON "ChatTracker"("owner_id");

-- AddForeignKey
ALTER TABLE "ChatTracker" ADD CONSTRAINT "ChatTracker_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationChat" ADD CONSTRAINT "NotificationChat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
