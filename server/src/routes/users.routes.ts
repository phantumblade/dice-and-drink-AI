import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import prisma from '../prisma';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

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
            include: {
                badges: true,
                bookings: true,
                registeredTournaments: {
                    include: { tournament: true }
                },
                campaignsJoined: {
                    include: { campaign: true, character: true }
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
