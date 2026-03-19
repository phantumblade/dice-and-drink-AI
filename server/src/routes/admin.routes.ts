import { Router } from 'express';
import prisma from '../prisma';
import { authenticateToken, requireAdmin, requireStaffOrAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

// Get Dashboard Stats
router.get('/stats', requireStaffOrAdmin, async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const activeTournaments = await prisma.tournament.count({
            where: { status: 'ongoing' }
        });
        const finishedTournaments = await prisma.tournament.count({
            where: { status: 'completed' }
        });
        const upcomingTournaments = await prisma.tournament.count({
            where: { status: 'upcoming' }
        });

        res.json({
            totalUsers,
            activeTournaments,
            finishedTournaments,
            upcomingTournaments
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch stats', error });
    }
});

// Get Charts Data
router.get('/charts', requireStaffOrAdmin, async (req, res) => {
    try {
        // Tournaments per year
        const tournaments = await prisma.tournament.findMany({
            select: { date: true, type: true }
        });

        const tournamentsPerYear = tournaments.reduce((acc: any, t) => {
            const year = new Date(t.date).getFullYear();
            acc[year] = (acc[year] || 0) + 1;
            return acc;
        }, {});

        // Tournaments per category
        const tournamentsPerCategory = tournaments.reduce((acc: any, t) => {
            acc[t.type] = (acc[t.type] || 0) + 1;
            return acc;
        }, {});

        // Participants per game type (using Product category or name)
        // This is a bit complex, let's approximate by Tournament Game
        const tournamentsWithParticipants = await prisma.tournament.findMany({
            include: {
                game: true,
                _count: {
                    select: { participants: true }
                }
            }
        });

        const participantsPerGame = tournamentsWithParticipants.reduce((acc: any, t) => {
            const gameName = t.game?.name || 'Unknown';
            if (!acc[gameName]) {
                acc[gameName] = { name: gameName, participants: 0, tournaments: 0 };
            }
            acc[gameName].participants += t.filled;
            acc[gameName].tournaments += 1;
            return acc;
        }, {});

        res.json({
            tournamentsPerYear: Object.entries(tournamentsPerYear).map(([year, count]) => ({ year, count })),
            tournamentsPerCategory: Object.entries(tournamentsPerCategory).map(([type, count]) => ({ type, count })),
            participantsPerGame: Object.values(participantsPerGame)
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch charts data', error });
    }
});

// Get All Users
router.get('/users', requireStaffOrAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                _count: {
                    select: { bookings: true, registeredTournaments: true }
                }
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error });
    }
});

// Delete User
router.delete('/users/:id', requireAdmin, async (req, res) => {
    try {
        await prisma.user.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error });
    }
});

export default router;
