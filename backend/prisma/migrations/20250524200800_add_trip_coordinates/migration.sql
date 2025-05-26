-- AlterTable
ALTER TABLE `trips` ADD COLUMN `end_latitude` DOUBLE NULL,
    ADD COLUMN `end_longitude` DOUBLE NULL,
    ADD COLUMN `start_latitude` DOUBLE NULL,
    ADD COLUMN `start_longitude` DOUBLE NULL;
