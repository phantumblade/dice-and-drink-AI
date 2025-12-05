-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'customer',
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "winRate" INTEGER NOT NULL DEFAULT 0,
    "favoriteGame" TEXT,
    "totalSpent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dateEarned" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "players" TEXT,
    "duration" TEXT,
    "alcohol" BOOLEAN,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "participants" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "userId" TEXT NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "gameId" TEXT,
    "entryFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "prizes" TEXT NOT NULL,
    "winnerId" TEXT,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rules" TEXT,
    "slots" INTEGER NOT NULL,
    "filled" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "deposit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gameSystem" TEXT,
    "includes" TEXT,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentParticipant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TournamentParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "system" TEXT NOT NULL,
    "dmId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "frequency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "deposit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxPlayers" INTEGER NOT NULL DEFAULT 4,
    "currentPlayers" INTEGER NOT NULL DEFAULT 0,
    "platform" TEXT NOT NULL DEFAULT 'In Person',
    "sessionDuration" TEXT NOT NULL DEFAULT '3-4 hours',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rules" TEXT,
    "plot" TEXT,
    "minPlayers" INTEGER NOT NULL DEFAULT 3,
    "levelRange" TEXT NOT NULL,
    "isProposal" BOOLEAN NOT NULL DEFAULT false,
    "proposalStatus" TEXT,
    "proposerId" TEXT,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
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

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignRequest" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignParticipant" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "summary" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "loot" TEXT,
    "enemies" TEXT,
    "quests" TEXT,
    "notes" TEXT,
    "campaignId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignNote" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'CHAT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaignId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT,

    CONSTRAINT "CampaignNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentParticipant_userId_tournamentId_key" ON "TournamentParticipant"("userId", "tournamentId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignParticipant_campaignId_characterId_key" ON "CampaignParticipant"("campaignId", "characterId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignParticipant_campaignId_userId_key" ON "CampaignParticipant"("campaignId", "userId");

-- AddForeignKey
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentParticipant" ADD CONSTRAINT "TournamentParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentParticipant" ADD CONSTRAINT "TournamentParticipant_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_dmId_fkey" FOREIGN KEY ("dmId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignRequest" ADD CONSTRAINT "CampaignRequest_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignRequest" ADD CONSTRAINT "CampaignRequest_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignRequest" ADD CONSTRAINT "CampaignRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignParticipant" ADD CONSTRAINT "CampaignParticipant_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignParticipant" ADD CONSTRAINT "CampaignParticipant_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignParticipant" ADD CONSTRAINT "CampaignParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignNote" ADD CONSTRAINT "CampaignNote_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignNote" ADD CONSTRAINT "CampaignNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignNote" ADD CONSTRAINT "CampaignNote_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
