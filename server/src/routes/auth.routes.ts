import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { serializeUserProfile, userProfileInclude } from '../utils/serializeUser';

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
            }
        });

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'supersecretkey',
            { expiresIn: '24h' }
        );

        const userProfile = await prisma.user.findUnique({
            where: { id: user.id },
            include: userProfileInclude,
        });

        if (!userProfile) {
            return res.status(500).json({ message: 'User created but profile could not be loaded' });
        }

        res.status(201).json({
            token,
            user: serializeUserProfile(userProfile)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'supersecretkey',
            { expiresIn: '24h' }
        );

        const userProfile = await prisma.user.findUnique({
            where: { id: user.id },
            include: userProfileInclude,
        });

        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            token,
            user: serializeUserProfile(userProfile)
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error });
    }
});

export default router;
