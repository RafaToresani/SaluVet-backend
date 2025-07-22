/*
  Warnings:

  - The values [CANINO,FELINO] on the enum `pets_species` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `pets` MODIFY `species` ENUM('PERRO', 'GATO', 'AVE', 'REPTIL', 'OTRO') NOT NULL;

-- CreateTable
CREATE TABLE `schedule_configs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vetId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `schedule_configs_vetId_key`(`vetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schedule_config_days` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scheduleId` INTEGER NOT NULL,
    `weekday` ENUM('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO') NOT NULL,
    `startTime` INTEGER NOT NULL,
    `endTime` INTEGER NOT NULL,

    UNIQUE INDEX `schedule_config_days_scheduleId_weekday_key`(`scheduleId`, `weekday`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `schedule_configs` ADD CONSTRAINT `schedule_configs_vetId_fkey` FOREIGN KEY (`vetId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule_config_days` ADD CONSTRAINT `schedule_config_days_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `schedule_configs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
