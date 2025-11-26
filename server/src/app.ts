import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/products.routes';
import tournamentRoutes from './routes/tournaments.routes';
import campaignRoutes from './routes/campaigns.routes';
import userRoutes from './routes/users.routes';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/users', userRoutes);

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
