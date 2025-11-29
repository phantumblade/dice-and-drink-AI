import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import productsRouter from './routes/products.routes';
import tournamentsRouter from './routes/tournaments.routes';
import bookingsRouter from './routes/bookings.routes';
import adminRouter from './routes/admin.routes';
import campaignsRouter from './routes/campaigns.routes';
import usersRouter from './routes/users.routes';
import charactersRouter from './routes/characters.routes';
import notificationsRouter from './routes/notifications.routes';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Serve static files from public/images and public/uploads
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRouter);
app.use('/api/tournaments', tournamentsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/campaigns', campaignsRouter);
app.use('/api/users', usersRouter);
app.use('/api/characters', charactersRouter);
app.use('/api/notifications', notificationsRouter);

app.get('/', (req, res) => {
    res.send('Dice & Drink API is running');
});

app.listen(PORT, '0.0.0.0', () => {
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    let networkIP = 'localhost';

    // Find the first non-internal IPv4 address
    for (const name of Object.keys(networkInterfaces)) {
        for (const net of networkInterfaces[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                networkIP = net.address;
                break;
            }
        }
        if (networkIP !== 'localhost') break;
    }

    console.log(`\n🎲 Dice & Drink Server Running!`);
    console.log(`📡 Local:    http://localhost:${PORT}`);
    console.log(`🌐 Network:  http://${networkIP}:${PORT}`);
    console.log(`\nUse the Network URL to access from your phone\n`);
});

export default app;
