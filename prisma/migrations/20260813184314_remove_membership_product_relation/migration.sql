/*
  Warnings:

  - You are about to drop the column `productId` on the `Membership` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_productId_fkey";

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "productId";
