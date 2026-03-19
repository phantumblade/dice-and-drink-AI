import { Router } from 'express';
import prisma from '../prisma';
import { authenticateToken, requireStaffOrAdmin } from '../middleware/auth.middleware';

const router = Router();

// Get all active campaigns or proposals
router.get('/', async (req, res) => {
    try {
        const campaigns = await prisma.campaign.findMany({
            // Fetch everything that isn't deleted/archived. Filter frontend side or use query params.
            // But usually we want RECRUITING/ACTIVE or Proposals.
            // Modifying to return all for now to let frontend filter "Board" vs "Active".
            include: {
                dm: { select: { id: true, name: true, avatar: true } },
                participants: { include: { character: true, user: { select: { id: true, name: true, avatar: true } } } },
                proposer: { select: { id: true, name: true, avatar: true } },
                _count: { select: { participants: true, requests: true } }
            },
            orderBy: { startDate: 'asc' }
        });
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
});

// Get single campaign details with full info
router.get('/:id', async (req, res) => {
    try {
        const campaign = await prisma.campaign.findUnique({
            where: { id: req.params.id },
            include: {
                dm: { select: { id: true, name: true, avatar: true } },
                proposer: { select: { id: true, name: true, avatar: true } },
                participants: { include: { character: true, user: { select: { id: true, name: true, avatar: true } } } },
                requests: {
                    include: {
                        user: { select: { id: true, name: true, avatar: true } },
                        character: true
                    },
                    orderBy: { createdAt: 'desc' }
                },
                sessions: { orderBy: { date: 'desc' } },
                notes: {
                    include: {
                        user: { select: { id: true, name: true, avatar: true } },
                        character: { select: { id: true, name: true, avatar: true } }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                _count: { select: { participants: true, requests: true } }
            }
        });
        if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch campaign' });
    }
});

// Create campaign (or Proposal)
router.post('/', async (req, res) => {
    try {
        const {
            title, description, system, type, levelRange,
            frequency, startDate, image,
            maxPlayers, minPlayers, platform, sessionDuration, tags, deposit,
            isProposal, proposerId, rules, plot
        } = req.body;

        // If it's a proposal, we might assign a placeholder DM or the user themselves?
        // Logic: If user proposes, they are NOT the DM yet.
        // But schema requires dmId.
        // We will assign it to the ADMIN (u_admin) or a special 'system' user if undefined.
        // For now, assume 'u_admin' exists from seed.
        let dmId = 'u_admin';

        // If user wants to be DM immediately, they should pass dmId as their own ID (handled by frontend logic usually)
        // But if isProposal is true, typically they are NOT the DM.
        if (!isProposal && req.body.dmId) {
            dmId = req.body.dmId;
        }

        const campaign = await prisma.campaign.create({
            data: {
                title,
                description,
                system: system || 'D&D 5e',
                type: type || 'SHORT_CAMPAIGN',
                dmId: dmId, // Required field
                startDate: startDate ? new Date(startDate) : new Date(),
                frequency: frequency || 'Weekly',
                status: isProposal ? 'RECRUITING' : 'RECRUITING', // Both start recruiting? Proposals need DM.
                proposalStatus: isProposal ? 'PENDING_DM' : undefined,
                isProposal: isProposal || false,
                proposerId: proposerId,
                image: image || 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80',
                levelRange: levelRange || '1-5',
                maxPlayers: maxPlayers ? parseInt(maxPlayers) : 6,
                minPlayers: minPlayers ? parseInt(minPlayers) : 3,
                platform: platform || 'In Person',
                sessionDuration: sessionDuration || '3-4 hours',
                tags: tags || '[]',
                deposit: deposit ? parseFloat(deposit) : 0,
                rules,
                plot
            }
        });

        res.status(201).json(campaign);
    } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({ error: 'Failed to create campaign' });
    }
});

// Update campaign (DM Updates, Rules, Plot, Notes)
router.put('/:id', async (req, res) => {
    try {
        const {
            title, description, system, type, levelRange,
            maxPlayers, minPlayers, image, status, frequency, startDate,
            platform, sessionDuration, tags,
            rules, plot, proposalStatus, dmId
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
                minPlayers: minPlayers ? parseInt(minPlayers) : undefined,
                platform,
                sessionDuration,
                tags,
                rules,
                plot,
                proposalStatus,
                dmId // Allow taking over DM ship
            }
        });
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update campaign' });
    }
});

// Request to join a campaign
router.post('/:id/request', async (req, res) => {
    const { userId, characterId, message } = req.body;
    try {
        // Enforce 1 character per campaign per player
        const existingParticipant = await prisma.campaignParticipant.findFirst({
            where: {
                campaignId: req.params.id,
                userId: userId
            }
        });
        if (existingParticipant) {
            return res.status(400).json({ error: 'You are already in this campaign!' });
        }

        // Check pending requests too?
        const existingRequest = await prisma.campaignRequest.findFirst({
            where: { campaignId: req.params.id, userId, status: 'PENDING' }
        });
        if (existingRequest) {
            return res.status(400).json({ error: 'Request already pending' });
        }

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
        console.error(error);
        res.status(500).json({ error: 'Failed to submit request' });
    }
});

// Post a Note (Chat Message)
router.post('/:id/notes', async (req, res) => {
    const { content, userId, characterId, type } = req.body;
    try {
        const note = await prisma.campaignNote.create({
            data: {
                campaignId: req.params.id,
                content,
                userId,
                characterId,
                type: type || 'CHAT'
            },
            include: {
                user: true,
                character: true
            }
        });
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: 'Failed to post note' });
    }
});

router.get('/requests/pending', authenticateToken, requireStaffOrAdmin, async (_req, res) => {
    try {
        const requests = await prisma.campaignRequest.findMany({
            where: { status: 'PENDING' },
            include: {
                campaign: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        isProposal: true
                    }
                },
                user: { select: { id: true, name: true, avatar: true } },
                character: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(requests);
    } catch (error) {
        console.error('Failed to fetch pending campaign requests:', error);
        res.status(500).json({ error: 'Failed to fetch pending campaign requests' });
    }
});

// --- Existing logic for Requests Approval ---
// Get pending requests (Admin only or DM) - usually protected by middleware
router.get('/:id/requests', async (req, res) => {
    try {
        const requests = await prisma.campaignRequest.findMany({
            where: { campaignId: req.params.id, status: 'PENDING' },
            include: {
                user: { select: { id: true, name: true, avatar: true } },
                character: true
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

        // Double check limits
        const currentCount = await prisma.campaignParticipant.count({ where: { campaignId: request.campaignId } });
        if (currentCount >= request.campaign.maxPlayers) {
            return res.status(400).json({ error: 'Campaign details full' });
        }

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

        await prisma.campaign.update({
            where: { id: request.campaignId },
            data: { currentPlayers: { increment: 1 } }
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to approve request' });
    }
});

// Reject request
router.post('/requests/:id/reject', async (req, res) => {
    try {
        await prisma.campaignRequest.update({
            where: { id: req.params.id },
            data: { status: 'REJECTED' }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reject request' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await prisma.campaign.delete({ where: { id: req.params.id } });
        res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete campaign' });
    }
});


export default router;
