-- CreateTable
CREATE TABLE `users_clinical_services` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `clinicalServiceId` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_clinical_services_userId_clinicalServiceId_key`(`userId`, `clinicalServiceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users_clinical_services` ADD CONSTRAINT `users_clinical_services_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_clinical_services` ADD CONSTRAINT `users_clinical_services_clinicalServiceId_fkey` FOREIGN KEY (`clinicalServiceId`) REFERENCES `clinical_services`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
