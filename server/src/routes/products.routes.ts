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

// Create product
router.post('/', async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                category,
                image,
                tags: JSON.stringify([]) // Default empty tags
            }
        });

        res.status(201).json({ ...product, tags: [] });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product', error });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;
        const product = await prisma.product.update({
            where: { id: req.params.id },
            data: { name, description, price, category, image }
        });
        res.json({ ...product, tags: JSON.parse(product.tags) });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        await prisma.product.delete({ where: { id: req.params.id } });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
});

export default router;
