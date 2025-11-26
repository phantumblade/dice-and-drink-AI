import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import prisma from '../prisma';

const router = Router();

// Get all tournaments
router.get('/', async (req, res) => {
    try {
        const tournaments = await prisma.tournament.findMany({
            include: {
                participants: {
                    include: { user: { select: { name: true, avatar: true } } }
                }
            }
        });

        const formatted = tournaments.map((t: any) => ({
            ...t,
            includes: JSON.parse(t.includes),
            participantsList: t.participants.map((p: any) => ({
                name: p.user.name,
                avatar: p.user.avatar
            }))
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tournaments', error });
    }
});

// Get tournament details
router.get('/:id', async (req, res) => {
    try {
        const tournament = await prisma.tournament.findUnique({
            where: { id: req.params.id },
            include: {
                participants: {
                    include: { user: { select: { name: true, avatar: true } } }
                }
            }
        });

        if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

        res.json({
            ...tournament,
            includes: JSON.parse(tournament.includes),
            participantsList: tournament.participants.map((p: any) => ({
                name: p.user.name,
                avatar: p.user.avatar
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tournament', error });
    }
});

// Join tournament
router.post('/:id/join', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const tournamentId = req.params.id;
        const userId = req.user!.userId;

        const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
        if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

        if (tournament.filled >= tournament.slots) {
            return res.status(400).json({ message: 'Tournament is full' });
        }

        // Check if already joined
        const existing = await prisma.tournamentParticipant.findUnique({
            where: { userId_tournamentId: { userId, tournamentId } }
        });

        if (existing) {
            return res.status(400).json({ message: 'Already joined' });
        }

        await prisma.$transaction([
            prisma.tournamentParticipant.create({
                data: { userId, tournamentId }
            }),
            prisma.tournament.update({
                where: { id: tournamentId },
                data: { filled: { increment: 1 } }
            })
        ]);

        res.json({ message: 'Successfully joined tournament' });
    } catch (error) {
        res.status(500).json({ message: 'Error joining tournament', error });
    }
});

export default router;
