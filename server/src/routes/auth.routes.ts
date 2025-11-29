import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
            }
        });

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'supersecretkey',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                registeredTournaments: [],
                pendingRequests: [],
                badges: [],
                bookings: [],
                stats: {
                    xp: 0,
                    gamesPlayed: 0,
                    winRate: 0,
                    favoriteGame: 'Nessuno',
                    totalSpent: 0
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'supersecretkey',
            { expiresIn: '24h' }
        );

        // Fetch all user data
        const registeredTournaments = await prisma.tournamentParticipant.findMany({
            where: { userId: user.id },
            include: { tournament: true }
        });

        // Tournament requests are not yet implemented in schema, returning empty
        const pendingRequests: string[] = [];

        const badges = await prisma.badge.findMany({
            where: { userId: user.id }
        });
        const bookings = await prisma.booking.findMany({
            where: { userId: user.id },
            include: { items: true }
        });

        console.log(`Login successful for: ${email} (${user.role})`);

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                registeredTournaments: registeredTournaments, // Return full objects
                pendingRequests: pendingRequests,
                badges,
                bookings: bookings.map(b => ({
                    id: b.id,
                    date: b.date.toISOString().split('T')[0],
                    time: b.time,
                    participants: b.participants,
                    duration: b.duration,
                    status: b.status,
                    items: b.items
                })),
                campaignsJoined: await prisma.campaignParticipant.findMany({
                    where: { userId: user.id },
                    include: { campaign: true, character: true }
                }),
                stats: {
                    xp: user.xp,
                    gamesPlayed: user.gamesPlayed,
                    winRate: user.winRate,
                    favoriteGame: user.favoriteGame || 'Nessuno',
                    totalSpent: user.totalSpent
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error });
    }
});

export default router;
