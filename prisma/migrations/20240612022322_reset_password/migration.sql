/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `resetToken` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_email_key` ON `users`(`email`);
