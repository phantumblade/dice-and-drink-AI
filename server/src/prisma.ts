import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import dotenv from 'dotenv';

import path from 'path';

dotenv.config();

let url = process.env.DATABASE_URL!;

// Handle SQLite file path resolution
if (url.startsWith('file:')) {
    const filePath = url.slice(5);
    if (filePath.startsWith('./')) {
        // Resolve relative to prisma folder (where schema usually is)
        // We assume the app runs from project root (server/)
        url = path.resolve(process.cwd(), 'prisma', filePath.slice(2));
    } else {
        url = filePath;
    }
}

const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

export default prisma;
