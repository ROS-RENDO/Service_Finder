/*
  Warnings:

  - You are about to drop the column `gradient` on the `service_types` table. All the data in the column will be lost.
  - You are about to drop the column `duration_minutes` on the `services` table. All the data in the column will be lost.
  - Added the required column `companyEarnings` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platformFee` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration_min` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `companyEarnings` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `platformFee` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `companies` ADD COLUMN `cardHighlights` JSON NOT NULL,
    ADD COLUMN `coverImageUrl` VARCHAR(191) NULL,
    ADD COLUMN `detailHighlights` JSON NOT NULL,
    ADD COLUMN `establishedYear` INTEGER NULL,
    ADD COLUMN `logoUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `service_types` DROP COLUMN `gradient`;

-- AlterTable
ALTER TABLE `services` DROP COLUMN `duration_minutes`,
    ADD COLUMN `duration_max` INTEGER NULL,
    ADD COLUMN `duration_min` INTEGER NOT NULL,
    ADD COLUMN `features` JSON NULL,
    ADD COLUMN `image` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `avatar` VARCHAR(191) NULL,
    MODIFY `status` ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active';
