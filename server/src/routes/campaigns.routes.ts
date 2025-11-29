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

        // Notify Admin
        const adminUser = await prisma.user.findUnique({ where: { email: 'admin@example.com' } });
        if (adminUser) {
            await prisma.notification.create({
                data: {
                    userId: adminUser.id,
                    type: 'INFO',
                    message: `Nuova richiesta di accesso per la campagna da parte di un utente.`
                }
            });
        }

        res.json(request);
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit request' });
    }
});

// Get pending requests (Admin only)
router.get('/requests/pending', async (req, res) => {
    try {
        const requests = await prisma.campaignRequest.findMany({
            where: { status: 'PENDING' },
            include: {
                user: { select: { id: true, name: true, avatar: true } },
                character: { select: { id: true, name: true, class: true, level: true } },
                campaign: { select: { id: true, title: true } }
            }
        });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});

// Approve request
router.post('/requests/:id/approve', async (req, res) => {
    try {
        const request = await prisma.campaignRequest.findUnique({
            where: { id: req.params.id },
            include: { campaign: true }
        });
        if (!request) return res.status(404).json({ error: 'Request not found' });

        // Update request status
        await prisma.campaignRequest.update({
            where: { id: req.params.id },
            data: { status: 'APPROVED' }
        });

        // Add to participants
        await prisma.campaignParticipant.create({
            data: {
                campaignId: request.campaignId,
                userId: request.userId,
                characterId: request.characterId
            }
        });

        // Notify User
        await prisma.notification.create({
            data: {
                userId: request.userId,
                type: 'SUCCESS',
                message: `La tua richiesta per la campagna "${request.campaign.title}" è stata accettata! Trovi la campagna nei tuoi tornei.`
            }
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to approve request' });
    }
});

// Reject request
router.post('/requests/:id/reject', async (req, res) => {
    try {
        const request = await prisma.campaignRequest.findUnique({
            where: { id: req.params.id },
            include: { campaign: true }
        });
        if (!request) return res.status(404).json({ error: 'Request not found' });

        await prisma.campaignRequest.update({
            where: { id: req.params.id },
            data: { status: 'REJECTED' }
        });

        // Notify User
        await prisma.notification.create({
            data: {
                userId: request.userId,
                type: 'ERROR',
                message: `La tua richiesta per la campagna "${request.campaign.title}" è stata rifiutata.`
            }
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reject request' });
    }
});

// Get campaign by ID
router.get('/:id', async (req, res) => {
    try {
        const campaign = await prisma.campaign.findUnique({
            where: { id: req.params.id },
            include: {
                dm: true,
                participants: {
                    include: {
                        user: true,
                        character: true
                    }
                },
                sessions: {
                    orderBy: { date: 'desc' }
                }
            }
        });
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch campaign' });
    }
});

// Create campaign
router.post('/', async (req, res) => {
    try {
        const {
            title, description, system, type, levelRange,
            frequency, startDate, image,
            maxPlayers, platform, sessionDuration, tags, deposit
        } = req.body;

        // Assign to Admin user by default for now
        const adminUser = await prisma.user.findUnique({ where: { email: 'admin@example.com' } });
        const dmId = adminUser ? adminUser.id : 'u_admin';

        const campaign = await prisma.campaign.create({
            data: {
                title,
                description,
                system,
                type: type || 'SHORT_CAMPAIGN',
                dmId: dmId,
                startDate: startDate ? new Date(startDate) : new Date(),
                frequency: frequency || 'Weekly',
                status: 'RECRUITING',
                image,
                levelRange: levelRange || '1-5',
                maxPlayers: maxPlayers ? parseInt(maxPlayers) : 4,
                platform: platform || 'In Person',
                sessionDuration: sessionDuration || '3-4 hours',
                tags: tags || '[]',
                deposit: deposit ? parseFloat(deposit) : 0
            }
        });

        res.status(201).json(campaign);
    } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({ error: 'Failed to create campaign' });
    }
});

// Update campaign
router.put('/:id', async (req, res) => {
    try {
        const {
            title, description, system, type, levelRange,
            maxPlayers, image, status, frequency, startDate,
            platform, sessionDuration, tags
        } = req.body;

        const campaign = await prisma.campaign.update({
            where: { id: req.params.id },
            data: {
                title,
                description,
                system,
                type,
                levelRange,
                image,
                status,
                frequency,
                startDate: startDate ? new Date(startDate) : undefined,
                maxPlayers: maxPlayers ? parseInt(maxPlayers) : undefined,
                platform,
                sessionDuration,
                tags
            }
        });
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update campaign' });
    }
});

// Delete campaign
router.delete('/:id', async (req, res) => {
    try {
        await prisma.campaign.delete({ where: { id: req.params.id } });
        res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete campaign' });
    }
});

export default router;
