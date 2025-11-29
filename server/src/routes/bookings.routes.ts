import { Router } from 'express';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Create a new booking
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { date, time, participants, duration, totalPrice, items } = req.body;
        const userId = req.user!.userId;

        // Create the booking
        const booking = await prisma.booking.create({
            data: {
                date: new Date(date), // Ensure date is a Date object
                time,
                participants,
                duration,
                totalPrice,
                status: 'confirmed', // Or 'pending' if you want approval
                userId,
                items: {
                    create: items.map((item: any) => ({
                        quantity: item.quantity,
                        productId: item.id
                    }))
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Failed to create booking', error });
    }
});

// Get user bookings
router.get('/my-bookings', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            where: { userId: req.user!.userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { date: 'desc' }
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch bookings', error });
    }
});

export default router;
