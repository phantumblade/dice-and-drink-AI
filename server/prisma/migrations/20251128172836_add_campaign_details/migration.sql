/*
  Warnings:

  - You are about to drop the `TournamentRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `dm` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentId` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `campaignId` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `dm` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `frequency` on the `Tournament` table. All the data in the column will be lost.
  - Added the required column `dmId` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frequency` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `levelRange` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hp` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxHp` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skills` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stats` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Character` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `prizes` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TournamentRequest";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CampaignRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CampaignRequest_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CampaignRequest_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CampaignRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CampaignParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CampaignParticipant_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CampaignParticipant_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CampaignParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "system" TEXT NOT NULL,
    "dmId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "frequency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "maxPlayers" INTEGER NOT NULL DEFAULT 4,
    "currentPlayers" INTEGER NOT NULL DEFAULT 0,
    "platform" TEXT NOT NULL DEFAULT 'In Person',
    "sessionDuration" TEXT NOT NULL DEFAULT '3-4 hours',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "levelRange" TEXT NOT NULL,
    CONSTRAINT "Campaign_dmId_fkey" FOREIGN KEY ("dmId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Campaign" ("description", "id", "image", "system", "title") SELECT "description", "id", "image", "system", "title" FROM "Campaign";
DROP TABLE "Campaign";
ALTER TABLE "new_Campaign" RENAME TO "Campaign";
CREATE TABLE "new_Character" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "background" TEXT,
    "alignment" TEXT,
    "stats" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "inventory" TEXT,
    "hp" INTEGER NOT NULL,
    "maxHp" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Character" ("avatar", "class", "id", "level", "name", "race", "status", "userId") SELECT "avatar", "class", "id", "level", "name", "race", "status", "userId" FROM "Character";
DROP TABLE "Character";
ALTER TABLE "new_Character" RENAME TO "Character";
CREATE TABLE "new_Tournament" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "gameId" TEXT,
    "entryFee" REAL NOT NULL DEFAULT 0,
    "prizes" TEXT NOT NULL,
    "winnerId" TEXT,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rules" TEXT,
    "slots" INTEGER NOT NULL,
    "filled" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "gameSystem" TEXT,
    "includes" TEXT,
    CONSTRAINT "Tournament_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Tournament_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Tournament" ("date", "description", "filled", "gameSystem", "id", "image", "includes", "rules", "slots", "status", "title", "type") SELECT "date", "description", "filled", "gameSystem", "id", "image", "includes", "rules", "slots", "status", "title", "type" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "CampaignParticipant_campaignId_characterId_key" ON "CampaignParticipant"("campaignId", "characterId");
