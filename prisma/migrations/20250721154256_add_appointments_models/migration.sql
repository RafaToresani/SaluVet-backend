-- CreateTable
CREATE TABLE `appointments` (
    `id` VARCHAR(191) NOT NULL,
    `petId` VARCHAR(191) NOT NULL,
    `vetId` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `extraTime` INTEGER NULL,
    `extraPrice` DOUBLE NULL,
    `extraPriceReason` VARCHAR(191) NULL,
    `extraTimeReason` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL,
    `startTime` INTEGER NOT NULL,
    `duration` INTEGER NOT NULL,
    `status` ENUM('PENDIENTE', 'CANCELADO', 'CONFIRMADO', 'NO_ASISTIDO', 'COMPLETO') NOT NULL DEFAULT 'PENDIENTE',
    `cancelReason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `appointments_date_vetId_idx`(`date`, `vetId`),
    INDEX `appointments_petId_idx`(`petId`),
    INDEX `appointments_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointments_clinical_services` (
    `appointmentId` VARCHAR(191) NOT NULL,
    `clinicalServiceId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`appointmentId`, `clinicalServiceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_petId_fkey` FOREIGN KEY (`petId`) REFERENCES `pets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_vetId_fkey` FOREIGN KEY (`vetId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments_clinical_services` ADD CONSTRAINT `appointments_clinical_services_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `appointments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments_clinical_services` ADD CONSTRAINT `appointments_clinical_services_clinicalServiceId_fkey` FOREIGN KEY (`clinicalServiceId`) REFERENCES `clinical_services`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
