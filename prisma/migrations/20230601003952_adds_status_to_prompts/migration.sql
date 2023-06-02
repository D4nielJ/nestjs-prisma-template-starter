-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'IN_PROGRESS', 'FAILURE', 'SUCCESS');

-- AlterTable
ALTER TABLE "Prompt" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';
