/*
  Warnings:

  - Made the column `userId` on table `Interaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `activityId` on table `Interaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Interaction" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "activityId" SET NOT NULL;
