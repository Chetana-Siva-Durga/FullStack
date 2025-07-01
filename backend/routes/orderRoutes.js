// ✅ routes/orderRoutes.js
import express from 'express';
import {
  placeOrder,
  getUserOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔹 User routes
router.post('/', authMiddleware, placeOrder);
router.get('/', authMiddleware, getUserOrders);
router.delete('/:id', authMiddleware, cancelOrder);

// 🔹 Admin routes
router.get('/list', getAllOrders); 
router.put('/status', updateOrderStatus);

export default router;
