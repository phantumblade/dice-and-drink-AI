import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import prisma from '../prisma';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const campaigns = await prisma.campaign.findMany({
            include: {
                party: true,
                sessions: true,
                notes: true
            }
        });
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching campaigns', error });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const campaign = await prisma.campaign.findUnique({
            where: { id: req.params.id },
            include: {
                party: true,
                sessions: true,
                notes: true
            }
        });

        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching campaign', error });
    }
});

export default router;
