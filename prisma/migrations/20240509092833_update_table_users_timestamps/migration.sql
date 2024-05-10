/*
  Warnings:

  - The `created_at` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updated_at` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deleted_at` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
ADD COLUMN     "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "updated_at",
ADD COLUMN     "updated_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "deleted_at",
ADD COLUMN     "deleted_at" DATE;
