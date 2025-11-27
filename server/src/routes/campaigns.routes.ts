import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// Get all active campaigns
router.get('/', async (req, res) => {
    try {
        const campaigns = await prisma.campaign.findMany({
            where: { status: { in: ['RECRUITING', 'ACTIVE'] } },
            include: {
                dm: { select: { id: true, name: true, avatar: true } },
                participants: { include: { character: true, user: { select: { id: true, name: true, avatar: true } } } },
                _count: { select: { participants: true, requests: true } }
            }
        });
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
});

// Get single campaign details
router.get('/:id', async (req, res) => {
    try {
        const campaign = await prisma.campaign.findUnique({
            where: { id: req.params.id },
            include: {
                dm: { select: { id: true, name: true, avatar: true } },
                participants: { include: { character: true, user: { select: { id: true, name: true, avatar: true } } } },
                sessions: true,
                notes: true
            }
        });
        if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch campaign' });
    }
});

// Request to join a campaign
router.post('/:id/request', async (req, res) => {
    const { userId, characterId, message } = req.body;
    try {
        // Check if already participant
        const existingParticipant = await prisma.campaignParticipant.findUnique({
            where: { campaignId_characterId: { campaignId: req.params.id, characterId } }
        });
        if (existingParticipant) return res.status(400).json({ error: 'Character already in campaign' });

        // Check if request pending
        const existingRequest = await prisma.campaignRequest.findFirst({
            where: { campaignId: req.params.id, characterId, status: 'PENDING' }
        });
        if (existingRequest) return res.status(400).json({ error: 'Request already pending' });

        const request = await prisma.campaignRequest.create({
            data: {
                campaignId: req.params.id,
                userId,
                characterId,
                message,
                status: 'PENDING'
            }
        });
        res.json(request);
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit request' });
    }
});

export default router;
