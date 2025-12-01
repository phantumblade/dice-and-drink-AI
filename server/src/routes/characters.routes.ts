import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// Get user's characters
router.get('/', async (req, res) => {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: 'UserId required' });

    try {
        const characters = await prisma.character.findMany({
            where: { userId },
            include: {
                campaigns: { include: { campaign: true } }
            }
        });
        res.json(characters);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch characters' });
    }
});

// Create new character
router.post('/', async (req, res) => {
    const { userId, name, race, class: charClass, level, stats, skills, background, alignment, avatar } = req.body;
    try {
        const character = await prisma.character.create({
            data: {
                userId,
                name,
                race,
                class: charClass,
                level,
                stats: JSON.stringify(stats),
                skills: JSON.stringify(skills),
                hp: 10 + (level * 5), // Simple HP calc for now
                maxHp: 10 + (level * 5),
                status: 'ALIVE',
                background,
                alignment,
                avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
            }
        });
        res.json(character);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create character' });
    }
});

// Get single character
router.get('/:id', async (req, res) => {
    try {
        const character = await prisma.character.findUnique({
            where: { id: req.params.id }
        });
        if (!character) return res.status(404).json({ error: 'Character not found' });
        res.json(character);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch character' });
    }
});

// Update character
router.put('/:id', async (req, res) => {
    const { name, race, class: charClass, level, stats, skills, background, alignment, avatar, hp, maxHp, status } = req.body;
    try {
        const character = await prisma.character.update({
            where: { id: req.params.id },
            data: {
                name,
                race,
                class: charClass,
                level,
                stats: typeof stats === 'string' ? stats : JSON.stringify(stats),
                skills: typeof skills === 'string' ? skills : JSON.stringify(skills),
                background,
                alignment,
                avatar,
                hp,
                maxHp,
                status
            }
        });
        res.json(character);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update character' });
    }
});

export default router;
