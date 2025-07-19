/*
  Warnings:

  - The primary key for the `schedule_config_days` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `schedule_configs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `updatedAt` to the `schedule_config_days` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `schedule_config_days` DROP FOREIGN KEY `schedule_config_days_scheduleId_fkey`;

-- AlterTable
ALTER TABLE `schedule_config_days` DROP PRIMARY KEY,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `scheduleId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `schedule_configs` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `schedule_config_days` ADD CONSTRAINT `schedule_config_days_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `schedule_configs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
