import { Router } from 'express';
import prisma from '../prisma';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Get unread notifications for current user
router.get('/', authenticateToken, async (req: any, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: {
                userId: req.user.id,
                read: false
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// Mark notification as read
router.post('/:id/read', authenticateToken, async (req: any, res) => {
    try {
        await prisma.notification.update({
            where: { id: req.params.id },
            data: { read: true }
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

export default router;
