-- DropForeignKey
ALTER TABLE `pets` DROP FOREIGN KEY `pets_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `schedule_config_days` DROP FOREIGN KEY `schedule_config_days_scheduleId_fkey`;

-- DropForeignKey
ALTER TABLE `schedule_configs` DROP FOREIGN KEY `schedule_configs_vetId_fkey`;

-- DropIndex
DROP INDEX `pets_ownerId_fkey` ON `pets`;

-- AddForeignKey
ALTER TABLE `pets` ADD CONSTRAINT `pets_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `owners`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule_configs` ADD CONSTRAINT `schedule_configs_vetId_fkey` FOREIGN KEY (`vetId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule_config_days` ADD CONSTRAINT `schedule_config_days_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `schedule_configs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
