-- CreateTable
CREATE TABLE `medical_records` (
    `id` VARCHAR(191) NOT NULL,
    `petId` VARCHAR(191) NOT NULL,
    `vetId` VARCHAR(191) NOT NULL,
    `appointmentId` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diagnosis` VARCHAR(191) NULL,
    `treatment` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vaccines` (
    `id` VARCHAR(191) NOT NULL,
    `medicalRecordsId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `medical_records` ADD CONSTRAINT `medical_records_petId_fkey` FOREIGN KEY (`petId`) REFERENCES `pets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medical_records` ADD CONSTRAINT `medical_records_vetId_fkey` FOREIGN KEY (`vetId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medical_records` ADD CONSTRAINT `medical_records_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `appointments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vaccines` ADD CONSTRAINT `vaccines_medicalRecordsId_fkey` FOREIGN KEY (`medicalRecordsId`) REFERENCES `medical_records`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
