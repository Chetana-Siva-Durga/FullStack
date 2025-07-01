// routes/cart.js
import express from 'express';
import { saveCart, getCart } from '../controllers/cartController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes protected with authMiddleware
router.put('/', authMiddleware, saveCart);
router.get('/', authMiddleware, getCart);

export default router;
