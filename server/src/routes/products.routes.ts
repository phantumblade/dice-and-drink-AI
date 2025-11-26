import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import prisma from '../prisma';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        // Parse tags JSON
        const formattedProducts = products.map((p: any) => ({
            ...p,
            tags: JSON.parse(p.tags)
        }));
        res.json(formattedProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await prisma.product.findUnique({ where: { id: req.params.id } });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.json({ ...product, tags: JSON.parse(product.tags) });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
});

export default router;
