/*
  Warnings:

  - You are about to drop the `Query` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Query";

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);
