import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import prisma from '../prisma';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { serializeUserProfile, userProfileInclude } from '../utils/serializeUser';

// Configure Multer (storage in memory to process with Sharp)
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

const router = Router();

router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.userId },
            include: userProfileInclude
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(serializeUserProfile(user));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
});

router.patch('/me', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const name = typeof req.body.name === 'string' ? req.body.name.trim() : undefined;
        const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : undefined;
        const avatar = typeof req.body.avatar === 'string' ? req.body.avatar.trim() : undefined;

        if (name === '' || email === '') {
            return res.status(400).json({ message: 'Name and email cannot be empty' });
        }

        const data = {
            ...(name ? { name } : {}),
            ...(email ? { email } : {}),
            ...(avatar ? { avatar } : {}),
        };

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ message: 'No valid fields provided' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.user!.userId },
            data,
            include: userProfileInclude,
        });

        res.json(serializeUserProfile(updatedUser));
    } catch (error: any) {
        if (error?.code === 'P2002') {
            return res.status(409).json({ message: 'Email already in use' });
        }

        res.status(500).json({ message: 'Error updating profile', error });
    }
});

router.post('/:id/avatar', authenticateToken, upload.single('avatar'), async (req: AuthRequest, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const userId = req.params.id;

        // Ensure user can only update their own avatar
        if (req.user!.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const filename = `avatar-${userId}-${Date.now()}.webp`;
        const uploadDir = path.join(__dirname, '../../public/uploads/avatars');

        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filepath = path.join(uploadDir, filename);

        // Compress and save image
        await sharp(req.file.buffer)
            .resize(500, 500, { fit: 'cover' }) // Resize to reasonable avatar size
            .webp({ quality: 80 }) // Compress to WebP
            .toFile(filepath);

        // Update user in DB
        // Assuming the server is running on localhost:3000 or configured URL
        // We'll store the relative path or full URL. Let's store relative for flexibility, 
        // but the frontend expects a URL. Let's construct a URL.
        // Ideally, we should use an env var for BASE_URL, but we'll use a relative path /uploads/avatars/...
        // and let the frontend handle the base URL or serve it directly.
        const avatarUrl = `/uploads/avatars/${filename}`;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { avatar: avatarUrl }
        });

        res.json({ message: 'Avatar updated', avatar: avatarUrl });
    } catch (error) {
        console.error('Avatar upload error:', error);
        res.status(500).json({ message: 'Error uploading avatar' });
    }
});

export default router;
