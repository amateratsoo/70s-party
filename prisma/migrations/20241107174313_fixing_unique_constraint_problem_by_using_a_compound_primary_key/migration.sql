/*
  Warnings:

  - The primary key for the `Guest` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Guest" DROP CONSTRAINT "Guest_pkey",
ADD CONSTRAINT "Guest_pkey" PRIMARY KEY ("phone_number", "country_code");
