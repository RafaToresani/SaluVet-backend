/*
  Warnings:

  - Added the required column `totalPrice` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `appointments` ADD COLUMN `totalPrice` DOUBLE NOT NULL;
