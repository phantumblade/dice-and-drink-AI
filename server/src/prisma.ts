import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔌 Connecting to PostgreSQL database...');

const prisma = new PrismaClient();

export default prisma;
