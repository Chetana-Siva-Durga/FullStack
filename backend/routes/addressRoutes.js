import express from 'express';
import {
  getAddress,
  saveAddress,
  updateAddress,  
  deleteAddress,
} from '../controllers/addressController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAddress);
router.post('/', authMiddleware, saveAddress);
router.put('/:addressId', authMiddleware, updateAddress); // ✅ Update route
router.delete('/:addressId', authMiddleware, deleteAddress);

export default router;
