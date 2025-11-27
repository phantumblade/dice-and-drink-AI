import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// Get all tournaments
router.get('/', async (req, res) => {
    try {
        const tournaments = await prisma.tournament.findMany({
            orderBy: { date: 'asc' },
            include: {
                game: true,
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true
                            }
                        }
                    }
                },
                winner: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                }
            }
        });
        res.json(tournaments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch tournaments' });
    }
});

// Get single tournament
router.get('/:id', async (req, res) => {
    try {
        const tournament = await prisma.tournament.findUnique({
            where: { id: req.params.id },
            include: {
                game: true,
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true
                            }
                        }
                    }
                },
                winner: true
            }
        });
        if (!tournament) {
            return res.status(404).json({ error: 'Tournament not found' });
        }
        res.json(tournament);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tournament' });
    }
});

// Join tournament
router.post('/:id/join', async (req, res) => {
    const { userId } = req.body;
    try {
        const tournament = await prisma.tournament.findUnique({
            where: { id: req.params.id },
            include: { participants: true }
        });

        if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

        if (tournament.participants.length >= tournament.slots) {
            return res.status(400).json({ error: 'Tournament is full' });
        }

        const existingParticipant = await prisma.tournamentParticipant.findUnique({
            where: {
                userId_tournamentId: {
                    userId,
                    tournamentId: req.params.id
                }
            }
        });

        if (existingParticipant) {
            return res.status(400).json({ error: 'User already registered' });
        }

        await prisma.tournamentParticipant.create({
            data: {
                userId,
                tournamentId: req.params.id
            }
        });

        // Update filled count
        await prisma.tournament.update({
            where: { id: req.params.id },
            data: { filled: { increment: 1 } }
        });

        res.json({ message: 'Successfully joined tournament' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to join tournament' });
    }
});

export default router;
