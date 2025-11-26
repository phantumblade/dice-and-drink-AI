import prisma from './src/prisma';

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
