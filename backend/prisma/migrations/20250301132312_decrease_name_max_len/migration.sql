/*
  Warnings:

  - You are about to alter the column `name` on the `Community` table. The data in that column could be lost. The data in that column will be cast from `VarChar(30)` to `VarChar(21)`.

*/
-- AlterTable
ALTER TABLE "Community" ALTER COLUMN "name" SET DATA TYPE VARCHAR(21);
