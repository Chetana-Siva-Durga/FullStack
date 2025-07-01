import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Express setup
const app = express();
const PORT = process.env.PORT || 5000;

// For __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '/uploads')));

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
import authRoutes from './routes/authRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import addressRoutes from './routes/addressRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/address', addressRoutes);

// Root route
app.get('/', (req, res) => res.send('✅ API is running...'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(buildPath));

  // Catch-all for React Router routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Ignore favicon.ico 404 noise
app.get('/favicon.ico', (req, res) => res.status(204).end());

// 404 handler for unmatched routes (only applies in dev mode)
app.use((req, res, next) => {
  console.error(`❌ Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: '❌ Route not found' });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ error: '❌ Something went wrong' });
});

// Connect to DB and start server
(async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  }
})();
