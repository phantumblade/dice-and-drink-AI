import type { Server } from 'http';
import app from './app';
import prisma from './prisma';
import { loadServerEnv } from './loadEnv';

loadServerEnv();

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '127.0.0.1';

let server: Server | null = null;
let shuttingDown = false;

const shutdown = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;

    console.log(`\n🛑 Received ${signal}. Shutting down server...`);

    await prisma.$disconnect().catch((error) => {
        console.error('Error while disconnecting Prisma:', error);
    });

    if (!server) {
        process.exit(0);
        return;
    }

    server.close((error) => {
        if (error) {
            console.error('Error while closing HTTP server:', error);
            process.exit(1);
            return;
        }

        process.exit(0);
    });
};

const startServer = () => {
    server = app.listen(Number(PORT), HOST, () => {
        console.log(`\n🎲 Dice & Drink Server Running!`);
        console.log(`📡 Local:    http://${HOST}:${PORT}`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
        console.error('\n❌ Failed to start Dice & Drink server');
        console.error(error);
        process.exit(1);
    });

    server.on('close', () => {
        if (!shuttingDown) {
            console.error('\n⚠️ Dice & Drink server closed unexpectedly.');
        }
    });
};

process.on('SIGINT', () => {
    void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
});

process.on('unhandledRejection', (reason) => {
    console.error('\n❌ Unhandled promise rejection in server process');
    console.error(reason);
});

process.on('uncaughtException', (error) => {
    console.error('\n❌ Uncaught exception in server process');
    console.error(error);
    process.exit(1);
});

startServer();
