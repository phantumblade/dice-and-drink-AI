import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Default path if env var is missing
const defaultDbPath = path.join(__dirname, '../prisma/dev.db');
let dbPath = defaultDbPath;

if (process.env.DATABASE_URL) {
    const url = process.env.DATABASE_URL;
    if (url.startsWith('file:')) {
        dbPath = url.slice(5);
    } else {
        dbPath = url;
    }
}

console.log('🔌 Connecting to database at:', dbPath);

const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

export default prisma;
