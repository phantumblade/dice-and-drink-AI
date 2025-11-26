import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import prisma from '../prisma';

const router = Router();

router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.userId },
            include: {
                badges: true,
                bookings: true,
                registeredTournaments: {
                    include: { tournament: true }
                }
            }
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
});

export default router;
