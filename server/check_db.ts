import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const prisma = new PrismaClient();

async function main() {
    try {
        const userCount = await prisma.user.count();
        const productCount = await prisma.product.count();
        const tournamentCount = await prisma.tournament.count();
        console.log(`Users: ${userCount}`);
        console.log(`Products: ${productCount}`);
        console.log(`Tournaments: ${tournamentCount}`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
