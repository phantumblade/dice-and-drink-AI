import { Router } from 'express';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

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

router.post('/:id/withdraw', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const tournamentId = req.params.id;
        const userId = req.user!.userId;

        const participant = await prisma.tournamentParticipant.findUnique({
            where: {
                userId_tournamentId: {
                    userId,
                    tournamentId,
                }
            }
        });

        if (!participant) {
            return res.status(404).json({ error: 'Registration not found' });
        }

        await prisma.tournamentParticipant.delete({
            where: {
                userId_tournamentId: {
                    userId,
                    tournamentId,
                }
            }
        });

        const tournament = await prisma.tournament.findUnique({
            where: { id: tournamentId },
            select: { filled: true }
        });

        if (tournament && tournament.filled > 0) {
            await prisma.tournament.update({
                where: { id: tournamentId },
                data: { filled: { decrement: 1 } }
            });
        }

        res.json({ message: 'Successfully withdrawn from tournament' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to withdraw from tournament' });
    }
});

// Create tournament
router.post('/', async (req, res) => {
    try {
        const { title, date, type, gameId, slots, entryFee, image, description, prizes, rules } = req.body;

        const tournament = await prisma.tournament.create({
            data: {
                title,
                date: new Date(date),
                type,
                gameId: gameId || null,
                slots,
                entryFee,
                image,
                description,
                prizes: prizes || '',
                rules: rules || '',
                status: 'upcoming',
                filled: 0
            }
        });

        res.status(201).json(tournament);
    } catch (error) {
        console.error('Error creating tournament:', error);
        res.status(500).json({ error: 'Failed to create tournament' });
    }
});

// Update tournament
router.put('/:id', async (req, res) => {
    try {
        const { title, date, type, slots, entryFee, image, description, prizes, rules, status } = req.body;
        const tournament = await prisma.tournament.update({
            where: { id: req.params.id },
            data: {
                title,
                date: date ? new Date(date) : undefined,
                type,
                slots,
                entryFee,
                image,
                description,
                prizes,
                rules,
                status
            }
        });
        res.json(tournament);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update tournament' });
    }
});

// Delete tournament
router.delete('/:id', async (req, res) => {
    try {
        await prisma.tournament.delete({ where: { id: req.params.id } });
        res.json({ message: 'Tournament deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete tournament' });
    }
});

export default router;
