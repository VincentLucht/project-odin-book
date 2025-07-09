/*
  Warnings:

  - Added the required column `is_mature` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "is_mature" BOOLEAN NOT NULL;
