-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'SOLD', 'INACTIVE');

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE';
