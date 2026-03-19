import { PrismaClient } from '@prisma/client';
import { loadServerEnv } from './loadEnv';

loadServerEnv();

console.log('🔌 Connecting to PostgreSQL database...');

const prisma = new PrismaClient();

export default prisma;
