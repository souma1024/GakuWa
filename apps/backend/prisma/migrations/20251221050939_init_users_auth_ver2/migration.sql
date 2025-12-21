/*
  Warnings:

  - You are about to drop the column `user_id` on the `email_otps` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `email_otps` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `email_otps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `email_otps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `email_otps` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `email_otps` DROP FOREIGN KEY `email_otps_user_id_fkey`;

-- DropIndex
DROP INDEX `email_otps_user_id_fkey` ON `email_otps`;

-- AlterTable
ALTER TABLE `email_otps` DROP COLUMN `user_id`,
    ADD COLUMN `email` VARCHAR(255) NOT NULL,
    ADD COLUMN `name` VARCHAR(100) NOT NULL,
    ADD COLUMN `password_hash` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `email_otps_email_key` ON `email_otps`(`email`);
